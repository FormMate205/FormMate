package com.corp.formmate.form.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.corp.formmate.chat.event.*;
import com.corp.formmate.form.dto.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.global.error.exception.PasswordException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.specialterm.dto.SpecialTermResponse;
import com.corp.formmate.specialterm.service.SpecialTermService;
import com.corp.formmate.transfer.service.TransferService;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.user.service.VerificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class FormService {

	private final FormRepository formRepository;
	private final UserService userService;
	private final SpecialTermService specialTermService;
	private final MessageService messageService;
	private final VerificationService verificationService;
	private final TransferService transferService;
	private final RedisTemplate<Object, Object> redisTemplate;

	// 이벤트 발생을 위한
	private final ApplicationEventPublisher eventPublisher;

	// 계약서 생성
	@Transactional
	public FormDetailResponse createForm(Integer userId, FormCreateRequest request) {
		request.validate();
		UserEntity creator = userService.selectById(userId);
		UserEntity receiver = userService.selectById(request.getReceiverId());
		UserEntity creditor = userService.selectById(request.getCreditorId());
		UserEntity debtor = userService.selectById(request.getDebtorId());

		checkAccount(creditor.getAccountNumber(), debtor.getAccountNumber());

		FormEntity formEntity = request.toEntity(request, creator, receiver, creditor, debtor);
		formRepository.save(formEntity);
		List<SpecialTermResponse> specialTermResponses = specialTermService.createSpecialTerms(formEntity,
			request.getSpecialTermIndexes());

		// 채팅 발송 위한 이벤트 발행
		log.info("계약서 생성 이벤트 발행: 폼 ID={}", formEntity.getId());
		eventPublisher.publishEvent(new FormCreatedEvent(formEntity));

		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// id로 FormDetailResponse 조회
	@Transactional(readOnly = true)
	public FormDetailResponse selectFormById(Integer formId) {
		FormEntity formEntity = selectById(formId);
		List<SpecialTermResponse> specialTermResponses = specialTermService.selectSpecialTermsByFormId(formId);
		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// 계약서 수정
	@Transactional
	public FormDetailResponse updateForm(Integer userId, Integer formId, FormUpdateRequest request) {
		request.validate();
		FormEntity formEntity = selectById(formId);
		if (userId == null) {
			throw new UserException(ErrorCode.USER_NOT_FOUND);
		}
		if (userId != formEntity.getCreator().getId()) {
			throw new FormException(ErrorCode.INVALID_CREATOR_ID);
		}
		checkAccount(formEntity.getCreditor().getAccountNumber(), formEntity.getDebtor().getAccountNumber());
		formEntity.update(request);
		formRepository.save(formEntity);
		List<SpecialTermResponse> specialTermResponses = specialTermService.updateSpecialTerms(formEntity,
			request.getSpecialTermIndexes());

		// 채팅 발송 위한 이벤트 발행
		log.info("계약서 수정 이벤트 발행: 폼 ID={}", formEntity.getId());
		eventPublisher.publishEvent(new FormUpdatedEvent(formEntity));

		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// id로 formEntity 조회
	@Transactional(readOnly = true)
	public FormEntity selectById(Integer formId) {
		FormEntity formEntity = formRepository.findById(formId).orElse(null);
		if (formEntity == null) {
			throw new FormException(ErrorCode.FORM_NOT_FOUND);
		}
		return formEntity;
	}

	// 로그인한 유저의 계약서 전체 조회(상태 : 전체, 진행중, 연체, 종료)
	@Transactional(readOnly = true)
	public Page<FormListResponse> selectForms(Integer currentUserId, String status, String name,
		Pageable pageable) {
		UserEntity userEntity = userService.selectById(currentUserId);

		// 상태 필터 처리
		FormStatus formStatus = null;
		if (status != null && !status.equals("전체")) {
			formStatus = FormStatus.fromKorName(status);
		}

		// 이름 필터 처리
		String searchName = (name != null && !name.trim().isEmpty()) ? name : null;

		// 조건에 맞는 폼 조회
		Page<FormEntity> formEntities = formRepository.findAllWithFilters(
			currentUserId, formStatus, searchName, pageable);

		if (formEntities.isEmpty()) {
			throw new FormException(ErrorCode.FORM_NOT_FOUND);
		}

		// Entity를 DTO로 변환해서 반환 (currentUserId 전달)
		return formEntities.map(entity -> FormListResponse.fromEntity(entity, currentUserId));
	}

	// 특정 유저의 계약 상태별 개수 조회(1. 대기중 : 상대승인전, 상대승인후 2. 진행중 3. 완료)
	@Transactional(readOnly = true)
	public FormCountResponse countUsersForm(Integer userId) {
		userService.selectById(userId);

		// 대기중 상태 합계
		Integer formPendingCount =
			formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.BEFORE_APPROVAL) +
				formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.AFTER_APPROVAL);

//		Integer formActiveCount = formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.IN_PROGRESS);
		// 진행중 상태 (종료 요청과 첫번째 서명 완료 상태 포함)
		Integer formActiveCount =
				formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.IN_PROGRESS) +
						formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.TERMINATION_REQUESTED) +
						formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.TERMINATION_FIRST_SIGNED);

		// 완료 상태
		Integer formCompletedCount = formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.COMPLETED);

		return FormCountResponse.builder()
			.formPendingCount(formPendingCount)
			.formActiveCount(formActiveCount)
			.formCompletedCount(formCompletedCount)
			.build();
	}

	// 최근 계약 상대 조회
	@Transactional(readOnly = true)
	public Page<FormPartnerResponse> selectFormPartner(Integer userId, String input, Pageable pageable) {

		String searchInput = (input != null && !input.trim().isEmpty()) ? input.trim() : null;

		Page<UserEntity> userEntities = formRepository.findDistinctContractedUsersByUserId(userId, searchInput,
			pageable);
		return userEntities.map(user -> new FormPartnerResponse(
			user.getId(),
			user.getUserName(),
			user.getPhoneNumber()
		));
	}

	// 계약 체결 요청 (채무자 - 첫번째 스텝)
	@Transactional
	public Boolean confirmRequestDebtorFormStatus(Integer currentUserId, FormConfirmRequest request) {

		Integer formId = request.getFormId();
		String userName = request.getUserName().trim();
		String phoneNumber = request.getPhoneNumber().trim();

		UserEntity userEntity = userService.selectById(currentUserId);
		if (!(userEntity.getUserName().equals(userName) && userEntity.getPhoneNumber().equals(phoneNumber))) {
			throw new FormException(ErrorCode.INVALID_DEBTOR);
		}

		FormEntity formEntity = selectById(formId);

		if (formEntity.getDebtor().getId() != currentUserId) {
			throw new FormException(ErrorCode.INVALID_DEBTOR);
		}

		confirmRequest(userEntity, formEntity, FormStatus.BEFORE_APPROVAL);

		// 채팅 발송 위한 이벤트 발행
		log.info("채무자 서명 이벤트 발행: 폼 ID={}", formEntity.getId());
		eventPublisher.publishEvent(new CreditorSignatureCompletedEvent(formEntity));

		return true;
	}

	// 계약 체결 인증 (채무자 - 첫번째 스텝)
	@Transactional
	public FormConfirmVerifyResponse confirmVerifyDebtorFormStatus(Integer currentUserId,
		@Valid FormConfirmVerifyRequest request) {

		Integer formId = request.getFormId();
		String phoneNumber = request.getPhoneNumber().trim();
		String verificationCode = request.getVerificationCode().trim();

		UserEntity userEntity = userService.selectById(currentUserId);
		if (!(userEntity.getPhoneNumber().equals(phoneNumber))) {
			throw new FormException(ErrorCode.INVALID_DEBTOR);
		}

		FormEntity formEntity = selectById(formId);

		if (formEntity.getDebtor().getId() != currentUserId) {
			throw new FormException(ErrorCode.INVALID_DEBTOR);
		}

		if (formEntity.getStatus() != FormStatus.BEFORE_APPROVAL) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		verifyConfirmRequest(phoneNumber, verificationCode);
		checkAccount(formEntity.getCreditor().getAccountNumber(), formEntity.getDebtor().getAccountNumber());

		formEntity.setStatus(FormStatus.AFTER_APPROVAL);
		formRepository.save(formEntity);

		return FormConfirmVerifyResponse.fromEntity(formEntity);
	}

	// 계약 체결 요청 (채권자 - 두번째 스텝)
	@Transactional
	public Boolean confirmRequestCreditorFormStatus(Integer currentUserId, @Valid FormConfirmRequest request) {

		Integer formId = request.getFormId();
		String userName = request.getUserName().trim();
		String phoneNumber = request.getPhoneNumber().trim();

		UserEntity userEntity = userService.selectById(currentUserId);
		if (!(userEntity.getUserName().equals(userName) && userEntity.getPhoneNumber().equals(phoneNumber))) {
			throw new FormException(ErrorCode.INVALID_CREDITOR);
		}

		FormEntity formEntity = selectById(formId);

		if (formEntity.getCreditor().getId() != currentUserId) {
			throw new FormException(ErrorCode.INVALID_CREDITOR);
		}

		confirmRequest(userEntity, formEntity, FormStatus.AFTER_APPROVAL);

		return true;
	}

	// 계약 체결 인증 (채권자 - 두번째 스텝)
	@Transactional
	public FormConfirmVerifyResponse confirmVerifyCreditorFormStatus(Integer currentUserId,
		@Valid FormConfirmVerifyRequest request) {

		Integer formId = request.getFormId();
		String phoneNumber = request.getPhoneNumber().trim();
		String verificationCode = request.getVerificationCode().trim();

		UserEntity userEntity = userService.selectById(currentUserId);
		if (!(userEntity.getPhoneNumber().equals(phoneNumber))) {
			throw new FormException(ErrorCode.INVALID_CREDITOR);
		}

		FormEntity formEntity = selectById(formId);

		if (formEntity.getCreditor().getId() != currentUserId) {
			throw new FormException(ErrorCode.INVALID_CREDITOR);
		}

		if (formEntity.getStatus() != FormStatus.AFTER_APPROVAL) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		verifyConfirmRequest(phoneNumber, verificationCode);
		checkAccount(formEntity.getCreditor().getAccountNumber(), formEntity.getDebtor().getAccountNumber());
		transferService.createInitialTransfer(formEntity);

		formEntity.setStatus(FormStatus.IN_PROGRESS);
		formRepository.save(formEntity);

		// 채팅 발송 위한 이벤트 발행
		log.info("채권자 서명 & 계약 체결 이벤트 발행: 폼 ID={}", formEntity.getId());
		eventPublisher.publishEvent(new CreditorSignatureCompletedEvent(formEntity));

		return FormConfirmVerifyResponse.fromEntity(formEntity);
	}

	@Transactional(readOnly = true)
	public List<FormEntity> selectFormsByUserId(Integer userId) {
		userService.selectById(userId); // 사용자 존재 여부 확인

		return formRepository.findAllByCreditorIdOrDebtorId(userId, userId);
	}

	// 인증번호 요청
	private void confirmRequest(UserEntity userEntity, FormEntity formEntity, FormStatus formStatus) {
		try {

			if (formEntity.getStatus() != formStatus) {
				throw new FormException(ErrorCode.INVALID_FORM_STATUS);
			}

			// 전화번호 정규화
			String normalizedPhone = messageService.normalizePhoneNumber(userEntity.getPhoneNumber());

			// 인증 코드 생성 및 Redis에 저장
			String code = verificationService.createAndStoreCode(normalizedPhone);

			// 인증 코드 전송
			boolean sent = messageService.sendVerificationCode(normalizedPhone, code);

			if (!sent) {
				log.error("Failed to send verification code to: {}", normalizedPhone);
				throw new PasswordException(ErrorCode.FAIL_MESSAGE_SEND);
			}
			log.info("Password reset verification code sent to: {}", normalizedPhone);
		} catch (PasswordException e) {
			log.error("Password error in verification: {}", e.getMessage());
			throw e;
		} catch (UserException e) {
			log.error("Error in password reset verification: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Unexpected error in password reset verification: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	// 인증번호 검증
	private void verifyConfirmRequest(String phoneNumber, String verificationCode) {
		try {
			// 전화번호 정규화
			String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

			// 인증 코드 확인
			verificationService.verifyCode(normalizedPhone, verificationCode);

			try {
				// 인증 성공 시 Redis에 인증 상태 저장 (예: 10분간 유효)
				String verifiedKey = "verified:" + normalizedPhone;
				redisTemplate.opsForValue()
					.set(verificationService.getVerificationKeyPrefix() + verifiedKey, "true", 10, TimeUnit.MINUTES);
				log.debug("인증 상태 저장 - 키: {}", verifiedKey);
			} catch (UserException e) {
				if (e.getErrorCode() == ErrorCode.USER_NOT_FOUND) {
					throw new PasswordException(ErrorCode.USER_NOT_FOUND);
				}
				throw e;
			}
		} catch (PasswordException e) {
			log.error("Password verification error: {}", e.getMessage());
			throw e; // 예외를 그대로 던져서 컨트롤러에서 처리하도록
		} catch (UserException e) {
			log.error("User error in password verification: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Unexpected error in password verification: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	private void checkAccount(String creditorAccount, String debtorAccount) {
		if (creditorAccount == null) {
			throw new FormException(ErrorCode.CREDITOR_ACCOUNT_NOT_FOUND);
		}
		if (debtorAccount == null) {
			throw new FormException(ErrorCode.DEBTOR_ACCOUNT_NOT_FOUND);
		}
	}

	/**
	 * 계약 파기 요청
	 */
	@Transactional
	public FormTerminationResponse requestTermination(Integer formId, Integer userId) {
		// 사용자와 계약 조회
		UserEntity user = userService.selectById(userId);
		FormEntity form = selectById(formId);

		// 계약 상태 확인
		if (form.getStatus() != FormStatus.IN_PROGRESS) {
			throw new FormException(ErrorCode.FORM_TERMINATION_NOT_ALLOWED);
		}

		// 채권자나 채무자만 파기 요청 가능
		if (!isParticipant(form, userId)) {
			throw new FormException(ErrorCode.FORM_TERMINATION_NOT_ALLOWED);
		}

		// 계약 상태 변경
		form.setStatus(FormStatus.TERMINATION_REQUESTED);
		formRepository.save(form);

		// 계약 파기 요청 이벤트 발생
		log.info("계약 파기 요청 이벤트 발행: form Id={}, 요청자 ID={}", formId, userId);
		eventPublisher.publishEvent(new FormTerminationRequestedEvent(form, userId));

		return FormTerminationResponse.builder()
				.formId(form.getId())
				.status(form.getStatus().name())
				.statusKorName(form.getStatus().getKorName())
				.requestedByName(user.getUserName())
				.build();
	}

	/**
	 * 계약 파기 첫 번째 당사자 인증 요청
	 */
	@Transactional
	public Boolean requestFirstSignVerification(Integer formId, Integer userId, FormTerminationVerifyRequest request) {
		// 사용자 검증
		UserEntity user = userService.selectById(userId);
		if (!user.getUserName().equals(request.getUserName()) ||
		!user.getPhoneNumber().equals(request.getPhoneNumber())) {
			throw new FormException(ErrorCode.INVALID_USER_INFO);
		}

		// 계약 조회
		FormEntity form = selectById(formId);

		// 상태 확인
		if (form.getStatus() != FormStatus.TERMINATION_REQUESTED) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		// 채권자나 채무자만 서명 가능
		if (!isParticipant(form, userId)) {
			throw new FormException(ErrorCode.FORM_TERMINATION_NOT_ALLOWED);
		}

		// 파기 요청자는 첫 번째 서명자가 될 수 없음 - 요청자 확인 방법
		// 시스템 메세지로 요청자 정보를 저장, 메세지 ID로 요청자 구분
		Integer requesterId = getOtherPartyId(form, userId);

		// 인증번호 발송
		sendVerificationCode(user);

		return true;
	}

	/**
	 * 계약 파기 첫 번째 당사자 인증 확인 및 서명
	 */
	@Transactional
	public FormTerminationResponse confirmFirstSignVerification(Integer formId, Integer userId, FormTerminationVerifyConfirmRequest request, FormTerminationSignRequest signRequest) {
		// 동의 확인
		if (signRequest.getConsent() == null || !signRequest.getConsent()) {
			throw new FormException(ErrorCode.FORM_TERMINATION_CONSENT_REQUIRED);
		}

		// 사용자 검증
		UserEntity user = userService.selectById(userId);
		if (!user.getPhoneNumber().equals(request.getPhoneNumber())) {
			throw new FormException(ErrorCode.INVALID_USER_INFO);
		}

		// 계약 조회
		FormEntity form = selectById(formId);

		// 상태 확인
		if (form.getStatus() != FormStatus.TERMINATION_REQUESTED) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		// 인증번호 확인
		verifyVerificationCode(request.getPhoneNumber(), request.getVerificationCode());

		// 계약 상태 변경
		form.setStatus(FormStatus.TERMINATION_FIRST_SIGNED);
		formRepository.save(form);

		// 첫 번째 서명 완료 이벤트 발생
		log.info("계약 파기 첫 번째 서명 완료 이벤트 발행: 폼 ID={}, 서명자 ID={}", formId, userId);
		eventPublisher.publishEvent(new FirstPartyTerminationSignedEvent(form, userId));

		return FormTerminationResponse.builder()
				.formId(form.getId())
				.status(form.getStatus().name())
				.statusKorName(form.getStatus().getKorName())
				.requestedByName(getOtherPartyName(form, userId))
				.build();
	}

	/**
	 * 계약 파기 두 번째 당사자 인증 요청
	 */
	@Transactional
	public Boolean requestSecondSignVerification(Integer formId, Integer userId, FormTerminationVerifyRequest request) {
		// 사용자 인증
		UserEntity user = userService.selectById(userId);
		if (!user.getUserName().equals(request.getUserName()) ||
				!user.getPhoneNumber().equals(request.getPhoneNumber())) {
			throw new FormException(ErrorCode.INVALID_USER_INFO);
		}

		// 계약 조회
		FormEntity form = selectById(formId);

		// 상태 확인
		if (form.getStatus() != FormStatus.TERMINATION_FIRST_SIGNED) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		// 첫 번째 서명자가 아닌 당사자만 두 번째 서명 가능
		// 여기서는 간단히 처리: 첫 번째 서명자 확인 방법이 불완전하므로 참여자만 확인
		if (!isParticipant(form, userId)) {
			throw new FormException(ErrorCode.FORM_TERMINATION_NOT_ALLOWED);
		}

		// 인증번호 발송
		sendVerificationCode(user);

		return true;
	}

	/**
	 * 계약 파기 두 번째 당사자 인증 확인 및 서명 (계약 종료)
	 */
	@Transactional
	public FormTerminationResponse confirmSecondSignVerification(Integer formId, Integer userId, FormTerminationVerifyConfirmRequest request, FormTerminationSignRequest signRequest) {
		// 동의 확인
		if (signRequest.getConsent() == null || !signRequest.getConsent()) {
			throw new FormException(ErrorCode.FORM_TERMINATION_CONSENT_REQUIRED);
		}

		// 사용자 검증
		UserEntity user = userService.selectById(userId);
		if (!user.getPhoneNumber().equals(request.getPhoneNumber())) {
			throw new FormException(ErrorCode.INVALID_USER_INFO);
		}

		// 계약 조회
		FormEntity form = selectById(formId);

		// 상태 확인
		if (form.getStatus() != FormStatus.TERMINATION_FIRST_SIGNED) {
			throw new FormException(ErrorCode.INVALID_FORM_STATUS);
		}

		// 인증번호 확인
		verifyVerificationCode(request.getPhoneNumber(), request.getVerificationCode());

		// 계약 상태를 종료로 변경
		form.setStatus(FormStatus.COMPLETED);
		formRepository.save(form);

		// 계약 종료 완료 이벤트 발행
		log.info("계약 파기 완료 이벤트 발행: 폼 ID={}", formId);
		eventPublisher.publishEvent(new FormTerminationCompletedEvent(form));

		return FormTerminationResponse.builder()
				.formId(form.getId())
				.status(form.getStatus().name())
				.statusKorName(form.getStatus().getKorName())
				.requestedByName(user.getUserName())
				.build();
	}

	/**
	 * 사용자가 계약의 참여자인지 확인
	 */
	private boolean isParticipant(FormEntity form, Integer userId) {
		return form.getCreditor().getId().equals(userId) || form.getDebtor().getId().equals(userId);
	}

	/**
	 * 계약의 상대 Id 조회 -> 리팩토링 (실제로는 이벤트 로그로 확인해야 함)
	 */
	private Integer getOtherPartyId(FormEntity form, Integer userId) {
		if (form.getCreditor().getId().equals(userId)) {
			return form.getDebtor().getId();
		} else {
			return form.getCreditor().getId();
		}
	}

	/**
	 * 계약의 상대 이름 조회
	 */
	private String getOtherPartyName(FormEntity form, Integer userId) {
		if (form.getCreditor().getId().equals(userId)) {
			return form.getDebtorName();
		} else {
			return form.getCreditorName();
		}
	}

	/**
	 * 인증번호 발송
	 */
	private void sendVerificationCode(UserEntity user) {
		try {
			// 전화번호 정규화
			String normalizedPhone = messageService.normalizePhoneNumber(user.getPhoneNumber());

			// 인증 코드 생성 및 Redis에 저장
			String code = verificationService.createAndStoreCode(normalizedPhone);

			// 인증 코드 전송
			boolean sent = messageService.sendVerificationCode(normalizedPhone, code);

			if (!sent) {
				log.error("Failed to send verification code to: {}", normalizedPhone);
				throw new PasswordException(ErrorCode.FAIL_MESSAGE_SEND);
			}
			log.info("계약 파기 인증 코드 발송: {}", normalizedPhone);
		} catch (PasswordException e) {
			log.error("Password error in verification: {}", e.getMessage());
			throw e;
		} catch (UserException e) {
			log.error("Error in verification: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Unexpected error in verification: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 인증번호 확인
	 */
	private void verifyVerificationCode(String phoneNumber, String verificationCode) {
		try {
			// 전화번호 정규화
			String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

			// 인증 코드 확인
			verificationService.verifyCode(normalizedPhone, verificationCode);

			log.info("계약 파기 인증 완료: {}", normalizedPhone);
		} catch (PasswordException e) {
			log.error("Password verification error: {}", e.getMessage());
			throw e;
		} catch (UserException e) {
			log.error("User error in verification: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Unexpected error in verification: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}
}
