package com.corp.formmate.mypage.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.AuthException;
import com.corp.formmate.global.error.exception.BusinessException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.mypage.dto.AccountRegisterRequest;
import com.corp.formmate.mypage.dto.AccountSearchRequest;
import com.corp.formmate.mypage.dto.CheckAccountPasswordRequest;
import com.corp.formmate.mypage.dto.SearchMyAccountResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.util.dto.BankAccountSearchResponse;
import com.corp.formmate.util.dto.BankVerifyOneWonRequest;
import com.corp.formmate.util.service.BankService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyAccountService {

	private final UserService userService;
	private final BankService bankService;
	private final MessageService messageService;
	private final RedisTemplate<String, Object> redisTemplate;

	/**
	 * 계좌 조회
	 */
	@Transactional(readOnly = true)
	public SearchMyAccountResponse selectMyAccount(Integer userId) {
		try {
			UserEntity user = userService.selectById(userId);
			String accountNum = user.getAccountNumber();

			// 계좌번호가 없는 경우 처리
			if (accountNum == null || accountNum.isEmpty()) {
				throw new UserException(ErrorCode.ACCOUNT_NOT_FOUND);
			}

			Long balance = bankService.selectBankAccountBalance(accountNum).getRec().getAccountBalance();

			return new SearchMyAccountResponse(
				user.getBankName(),
				user.getAccountNumber(),
				balance
			);
		} catch (UserException e) {
			log.error("사용자 계좌 조회 실패: {}", e.getMessage());
			throw e;
		} catch (BusinessException e) {
			log.error("계좌 조회 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("사용자 계좌 조회 조회 중 오류: {}", e.getMessage());
			throw new UserException(ErrorCode.BANK_CONNECTION_ERROR);
		}
	}

	/**
	 * 계좌 정보 입력 및 존재 여부 확인
	 */
	@Transactional
	public void searchAndVerifyMyAccount(Integer userId, AccountSearchRequest request) {
		try {
			// 해당 사용자에게 이미 계좌가 등록되어 있는지 확인
			UserEntity user = userService.selectById(userId);
			if (user.getAccountNumber() != null && !user.getAccountNumber().isEmpty()) {
				throw new UserException(ErrorCode.ACCOUNT_ALREADY_EXIST);
			}

			// 해당 계좌 존재하는지 확인
			BankAccountSearchResponse response = bankService.selectBankAccount(request.getAccountNumber());
			if (response == null) {
				throw new UserException(ErrorCode.ACCOUNT_NOT_FOUND);
			}

			// 입력한 은행과 실제 은행이 일치하는지 확인
			String actualBankName = response.getRec().getBankName();
			if (!actualBankName.equalsIgnoreCase(request.getBankName())) {
				throw new UserException(ErrorCode.INVALID_BANK_NAME_AND_ACCOUNT);
			}

			// 1원 송금
			sendToVerifyMyAccount(userId, request.getBankName(), request.getAccountNumber());
		} catch (BusinessException e) {
			// 은행 API에서 발생하는 비즈니스 예외 처리
			log.error("계좌 정보 조회 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			// 기타 예외 처리
			log.error("계좌 정보 조회 중 오류 발생: {}", e.getMessage());
			throw new UserException(ErrorCode.BANK_CONNECTION_ERROR);
		}
	}

	/**
	 * 1원 인증 요청
	 */
	@Transactional
	public void sendToVerifyMyAccount(Integer userId, String bankName, String accountNumber) {
		// 1원 송금 후 받아온 인증코드
		String fromBank = bankService.selectSendOneWon(accountNumber).getRec().getTransactionSummary();
		// 인증코드 숫자만 split
		String verifyNumber = fromBank.replaceAll("[^0-9]", "");
		// 인증 String 수정
		String verifyString = "FM " + verifyNumber;

		// Redis에 인증 정보 저장
		String cacheKey = "account:auth:" + accountNumber;
		redisTemplate.opsForValue().set(cacheKey, verifyNumber, 10, TimeUnit.MINUTES);

		// 전화번호 검색
		String phoneNumber = userService.selectById(userId).getPhoneNumber();
		// 전화번호 정규화
		String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);
		// 메세지 전송
		boolean messageSent = messageService.sendBankAnnouncement(
			normalizedPhone,
			bankName,
			maskAccountNumber(accountNumber),
			verifyString
		);

		if (!messageSent) {
			throw new AuthException(ErrorCode.SMS_SEND_FAILED);
		}
	}

	/**
	 * 1원 인증 검증
	 */
	@Transactional
	public boolean verifyMyAccount(String accountNumber, String verificationCode) {
		// 인증 시도 횟수 확인 및 제한
		String cacheKey = "account:verify:" + accountNumber;
		Integer attemptCount = redisTemplate.opsForValue().get(cacheKey) != null ?
			(Integer)redisTemplate.opsForValue().get(cacheKey) : 0;

		if (attemptCount >= 5) {
			throw new AuthException(ErrorCode.VERIFICATION_ATTEMPT_EXCEEDED);
		}

		boolean verified = bankService.selectVerifyOneWon(
			BankVerifyOneWonRequest.builder()
				.accountNo(accountNumber)
				.authCode(verificationCode)
				.build()
		);

		if (!verified) {
			// 실패 시 시도 횟수 증가
			redisTemplate.opsForValue().set(cacheKey, attemptCount + 1, 30, TimeUnit.MINUTES);
		} else {
			// 성공 시 시도 횟수 초기화
			redisTemplate.delete(cacheKey);
		}

		return verified;
	}

	/**
	 * 계좌 등록
	 */
	@Transactional
	public void registMyAccount(Integer userId, AccountRegisterRequest request) {
		boolean verified = verifyMyAccount(request.getAccountNumber(), request.getVerificationCode());
		if (!verified) {
			throw new AuthException(ErrorCode.ACCOUNT_VERIFICATION_FAILED);
		}
		UserEntity user = userService.selectById(userId);
		user.updateAccount(request.getBankName(), request.getAccountNumber(), request.getAccountPassword());
	}

	/**
	 * 계좌 삭제
	 */
	@Transactional
	public void deleteMyAccount(Integer userId) {
		UserEntity user = userService.selectById(userId);
		user.deleteAccount();
	}

	/**
	 * 계좌번호를 마스킹 처리하는 메서드 (숫자만 있는 형식)
	 * 예: "1234567890123" -> "123-***-0123"
	 * @param accountNumber 마스킹할 계좌번호
	 * @return 마스킹된 계좌번호
	 */
	private String maskAccountNumber(String accountNumber) {
		if (accountNumber == null || accountNumber.isEmpty()) {
			return "";
		}

		int length = accountNumber.length();

		if (length <= 6) {
			// 계좌번호가 너무 짧으면 앞 부분만 표시
			return accountNumber.substring(0, 3) + "-***";
		}

		// 앞 3자리
		String prefix = accountNumber.substring(0, 3);

		// 뒤 6자리
		String suffix = accountNumber.substring(length - 6);

		// 중간에 하이픈과 별표 추가하여 반환
		return prefix + "-***-" + suffix;
	}

	@Transactional(readOnly = true)
	public boolean checkAccountPassword(Integer userId, CheckAccountPasswordRequest request) {
		String password = request.getAccountPassword();
		if (password == null || password.isEmpty()) {
			throw new UserException(ErrorCode.INVALID_INPUT_VALUE);
		}
		UserEntity user = userService.selectById(userId);
		String accountPassword = user.getAccountPassword();
		if (accountPassword == null || accountPassword.isEmpty()) {
			throw new UserException(ErrorCode.ACCOUNT_PASSWORD_NOT_FOUND);
		}
		if (accountPassword.equals(password)) {
			return true;
		}
		return false;
	}
}
