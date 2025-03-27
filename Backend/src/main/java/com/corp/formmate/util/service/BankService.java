package com.corp.formmate.util.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.TransferException;
import com.corp.formmate.util.dto.BankAccountBalanceResponse;
import com.corp.formmate.util.dto.BankAccountSearchResponse;
import com.corp.formmate.util.dto.BankAuthCodeResponse;
import com.corp.formmate.util.dto.BankSendOneWonResponse;
import com.corp.formmate.util.dto.BankTransferRequest;
import com.corp.formmate.util.dto.BankTransferResponse;
import com.corp.formmate.util.dto.BankVerifyOneWonRequest;
import com.corp.formmate.util.dto.BankVerifyOneWonResponse;
import com.corp.formmate.util.header.BankHeader;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class BankService {

	private final RestTemplate restTemplate;

	private final BankHeader bankHeader;

	@Value("${bank.api.url}")
	private String baseUrl;

	/**
	 * 계좌 정보 조회 (단일 파라미터 사용)
	 * @param accountNumber 계좌번호
	 * @return 계좌 정보 응답
	 */
	public BankAccountSearchResponse selectBankAccount(String accountNumber) {
		// API 이름 정의
		String apiName = "inquireDemandDepositAccount";
		// 엔드포인트 정의
		String endpoint = "edu/demandDeposit/inquireDemandDepositAccount";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = new HashMap<>();
		requestData.put("accountNo", accountNumber);

		// API 호출 및 응답 반환
		return callBankApi(apiName, endpoint, requestData, BankAccountSearchResponse.class);
	}

	/**
	 * 계좌 이체 거래 (다중 파라미터 사용)
	 * 거래 정상적으로 이루어 지면 true
	 * 계좌번호가 유효하지 않거나 거래 금액 부족이면 예외처리
	 * 나머지는 모두 false (위에서 작성한 이유 외의 이유로 거래 정상적으로 이루어지지 x)
	 * @return boolean
	 */
	public boolean createBankTransfer(BankTransferRequest bankTransferRequest) {
		String apiName = "updateDemandDepositAccountTransfer";
		// 엔드포인트 정의
		String endpoint = "edu/demandDeposit/updateDemandDepositAccountTransfer";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = bankTransferRequest.toMap();

		// API 호출 및 응답 반환
		BankTransferResponse response = callBankApi(apiName, endpoint, requestData, BankTransferResponse.class);

		String code = response.getHeader().getResponseCode();

		return switch (code) {
			case "H0000" -> true;
			case "A1003" -> throw new TransferException(ErrorCode.INVALID_ACCOUNT_NUMBER);
			case "A1014" -> throw new TransferException(ErrorCode.INSUFFICIENT_BALANCE);
			default -> throw new TransferException(ErrorCode.EXTERNAL_API_ERROR);
		};
	}

	/**
	 * 계좌 잔액 조회 (단일 파라미터 사용)
	 * @param accountNumber 계좌번호
	 * @return 계좌 잔액 응답
	 */
	public BankAccountBalanceResponse selectBankAccountBalance(String accountNumber) {
		// API 이름 정의
		String apiName = "inquireDemandDepositAccountBalance";
		// 엔드포인트 정의
		String endpoint = "edu/demandDeposit/inquireDemandDepositAccountBalance";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = new HashMap<>();
		requestData.put("accountNo", accountNumber);

		// API 호출 및 응답 반환
		return callBankApi(apiName, endpoint, requestData, BankAccountBalanceResponse.class);
	}

	/**
	 * 1원 송금 (단일 파라미터 사용)
	 * @param accountNumber 계좌번호
	 * @return BankAuthCodeResponse 반환
	 */
	public BankAuthCodeResponse selectSendOneWon(String accountNumber) {
		// API 이름 정의
		String apiName = "openAccountAuth";
		// 엔드포인트 정의
		String endpoint = "edu/accountAuth/openAccountAuth";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = new HashMap<>();
		requestData.put("accountNo", accountNumber);
		requestData.put("authText", "formmate");

		BankSendOneWonResponse response = callBankApi(apiName, endpoint, requestData, BankSendOneWonResponse.class);

		String code = response.getHeader().getResponseCode();

		switch (code) {
			case "H0000" -> {
				return selectAccountAuthCode(accountNumber, response.getRec().getTransactionUniqueNo());
			}
			case "A1003" -> throw new TransferException(ErrorCode.INVALID_ACCOUNT_NUMBER);
			default -> throw new TransferException(ErrorCode.EXTERNAL_API_ERROR);
		}
	}

	/**
	 * 1원 송금 인증코드 반환 메서드
	 * @return BankAuthCodeResponse 반환
	 */
	private BankAuthCodeResponse selectAccountAuthCode(String accountNumber, Long transactionUniqueNo) {
		// API 이름 정의
		String apiName = "inquireTransactionHistory";
		// 엔드포인트 정의
		String endpoint = "edu/demandDeposit/inquireTransactionHistory";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = new HashMap<>();
		requestData.put("accountNo", accountNumber);
		requestData.put("transactionUniqueNo", transactionUniqueNo);

		return callBankApi(apiName, endpoint, requestData, BankAuthCodeResponse.class);
	}

	/**
	 * 1원 송금 검증
	 * @return boolean 반환
	 */
	public boolean selectVerifyOneWon(BankVerifyOneWonRequest bankVerifyOneWonRequest) {
		// API 이름 정의
		String apiName = "checkAuthCode";
		// 엔드포인트 정의
		String endpoint = "edu/accountAuth/checkAuthCode";

		// 단일 파라미터를 Map으로 직접 조립
		Map<String, Object> requestData = bankVerifyOneWonRequest.toMap();

		BankVerifyOneWonResponse response = callBankApi(apiName, endpoint, requestData, BankVerifyOneWonResponse.class);

		String code = response.getHeader().getResponseCode();

		switch (code) {
			case "H0000" -> {
				String status = response.getRec().getStatus();
				return status.equals("SUCCESS");
			}
			case "A1003" -> throw new TransferException(ErrorCode.INVALID_ACCOUNT_NUMBER);
			case "A1086" -> throw new TransferException(ErrorCode.VERIFY_NOT_FOUND);
			case "A1087" -> throw new TransferException(ErrorCode.EXPIRED_VERIFY_TIME);
			case "A1088" -> throw new TransferException(ErrorCode.VERIFY_NOT_MATCHED);
			default -> throw new TransferException(ErrorCode.EXTERNAL_API_ERROR);
		}
	}

	/**
	 * 범용 API 호출 메서드 (Map 사용)
	 * @param <T> 응답 타입
	 * @param apiName API 이름
	 * @param endpoint API 엔드포인트 경로
	 * @param requestData 요청 데이터 맵
	 * @param responseType 응답 클래스 타입
	 * @return API 응답
	 */
	private <T> T callBankApi(String apiName, String endpoint, Map<String, Object> requestData, Class<T> responseType) {
		// 헤더 객체 생성
		BankHeader header = bankHeader.generateHeader(apiName);

		// 요청 바디 생성
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("Header", createHeaderMap(header));

		// 요청 데이터가 있으면 추가
		if (requestData != null && !requestData.isEmpty()) {
			requestBody.putAll(requestData);
		}

		// HTTP 헤더 생성
		HttpHeaders headers = createHttpHeaders(header);

		// HTTP 요청 엔티티 생성
		HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

		// API 호출 및 응답 처리
		return executeApiCall(baseUrl + endpoint, requestEntity, responseType);
	}

	/**
	 * 헤더 맵 생성 메서드
	 * @param header BankHeader 객체
	 * @return 헤더 정보가 담긴 맵
	 */
	private Map<String, Object> createHeaderMap(BankHeader header) {
		Map<String, Object> headerMap = new HashMap<>();
		headerMap.put("apiName", header.getApiName());
		headerMap.put("transmissionDate", header.getTransmissionDate());
		headerMap.put("transmissionTime", header.getTransmissionTime());
		headerMap.put("institutionCode", header.getInstitutionCode());
		headerMap.put("fintechAppNo", header.getFintechAppNo());
		headerMap.put("apiServiceCode", header.getApiServiceCode());
		headerMap.put("institutionTransactionUniqueNo", header.getInstitutionTransactionUniqueNo());
		headerMap.put("apiKey", header.getApiKey());
		headerMap.put("userKey", header.getUserKey());
		return headerMap;
	}

	/**
	 * HTTP 헤더 생성 메서드
	 * @param header BankHeader 객체
	 * @return 설정된 HttpHeaders 객체
	 */
	private HttpHeaders createHttpHeaders(BankHeader header) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("X-API-NAME", header.getApiName());
		headers.set("X-TRANSMISSION-DATE", header.getTransmissionDate());
		headers.set("X-TRANSMISSION-TIME", header.getTransmissionTime());
		headers.set("X-INSTITUTION-CODE", header.getInstitutionCode());
		headers.set("X-FINTECH-APP-NO", header.getFintechAppNo());
		headers.set("X-API-SERVICE-CODE", header.getApiServiceCode());
		headers.set("X-INSTITUTION-TRANSACTION-UNIQUE-NO", header.getInstitutionTransactionUniqueNo());
		headers.set("X-API-KEY", header.getApiKey());
		headers.set("X-USER-KEY", header.getUserKey());
		return headers;
	}

	/**
	 * API 호출 및 응답 처리 메서드
	 * @param <T> 응답 타입
	 * @param url 요청 URL
	 * @param requestEntity HTTP 요청 엔티티
	 * @param responseType 응답 클래스 타입
	 * @return API 응답
	 */
	private <T> T executeApiCall(String url, HttpEntity<?> requestEntity, Class<T> responseType) {
		try {
			log.debug("Bank API Request: {}", requestEntity.getBody());

			// API 호출
			ResponseEntity<T> response = restTemplate.exchange(
				url,
				HttpMethod.POST,
				requestEntity,
				responseType
			);

			log.debug("Bank API Response: {}", response.getBody());

			// 응답 처리
			if (response.getStatusCode().is2xxSuccessful()) {
				return response.getBody();
			} else {
				throw new TransferException(ErrorCode.EXTERNAL_API_ERROR);
			}
		} catch (Exception e) {
			log.error("Bank API Error: {}", e.getMessage(), e);
			throw new TransferException(ErrorCode.EXTERNAL_API_ERROR);
		}
	}
}
