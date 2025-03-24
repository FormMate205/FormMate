package com.corp.formmate.global.error.code;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	// Common
	INVALID_INPUT_VALUE(400, "잘못된 입력값입니다"),
	INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다"),
	UNAUTHORIZED(401, "인증되지 않은 접근입니다"),
	FORBIDDEN(403, "권한이 없습니다"),
	INVALID_ENUM_VALUE(400, "잘못된 상태값입니다"),

	// Auth & User
	INVALID_TOKEN(401, "유효하지 않은 토큰입니다"),
	EXPIRED_TOKEN(401, "만료된 토큰입니다"),
	REFRESH_TOKEN_NOT_FOUND(401, "리프레시 토큰을 찾을 수 없습니다"),
	EMAIL_DUPLICATE(400, "이미 존재하는 이메일입니다"),
	INVALID_PASSWORD(400, "잘못된 비밀번호입니다"),
	INVALID_ROLE_TYPE(400, "잘못된 권한 타입입니다"),
	LOGIN_BAD_CREDENTIALS(401, "이메일 또는 비밀번호가 일치하지 않습니다"),
	LOGIN_FAILED(401, "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요"),
	USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다"),
	USER_SEARCH_ERROR(500, "사용자 정보 조회 중 오류가 발생했습니다"),
	INVALID_EMAIL_VERIFICATION(401, "유효하지 않은 인증 토큰입니다"),
	EXPIRED_EMAIL_VERIFICATION(401, "만료된 인증 토큰입니다"),
	DUPLICATE_EMAIL(400, "이미 등록된 이메일입니다"),
	FAIL_MESSAGE_SEND(500, "문자 발송에 실패했습니다"),
	PHONE_VERIFICATION_FAILED(400, "휴대전화 인증에 실패했습니다"),
	PHONE_VERIFICATION_EXPIRED(400, "휴대전화 인증이 만료되었습니다"),
	PHONE_ALREADY_REGISTERED(400, "이미 등록된 휴대전화 번호입니다"),
	LOGOUT_FAILED(500, "로그아웃 처리 중 오류가 발생했습니다"),
	NOT_AUTHENTICATED(401, "인증되지 않은 사용자입니다"),

	// 계좌 관련
	ACCOUNT_NOT_FOUND(404, "계좌 정보를 찾을 수 없습니다"),
	INVALID_ACCOUNT_NUMBER(400, "유효하지 않은 계좌번호입니다"),
	ACCOUNT_PASSWORD_MISMATCH(400, "계좌 비밀번호가 일치하지 않습니다"),
	INSUFFICIENT_BALANCE(400, "잔액이 부족합니다"),
	BANK_CONNECTION_ERROR(500, "은행 시스템 연결 중 오류가 발생했습니다"),
	ACCOUNT_ALREADY_REGISTERED(400, "이미 등록된 계좌입니다"),
	INVALID_BANK_CODE(400, "유효하지 않은 은행 코드입니다"),

	// 계약 관련
	CONTRACT_NOT_FOUND(404, "계약을 찾을 수 없습니다"),
	INVALID_CONTRACT_STATUS(400, "잘못된 계약 상태입니다"),
	CONTRACT_ALREADY_CONFIRMED(400, "이미 체결된 계약입니다"),
	CONTRACT_ALREADY_TERMINATED(400, "이미 종료된 계약입니다"),
	CONTRACT_MODIFICATION_FORBIDDEN(403, "계약 상태에서는 수정이 불가능합니다"),
	CONTRACT_EXECUTION_FAILED(500, "계약 체결 중 오류가 발생했습니다"),
	INVALID_CREDITOR(400, "유효하지 않은 채권자 정보입니다"),
	INVALID_DEBTOR(400, "유효하지 않은 채무자 정보입니다"),
	INVALID_LOAN_AMOUNT(400, "유효하지 않은 대출 금액입니다"),
	INVALID_INTEREST_RATE(400, "유효하지 않은 이자율입니다"),
	INVALID_REPAYMENT_METHOD(400, "유효하지 않은 상환 방식입니다"),
	INVALID_REPAYMENT_DAY(400, "유효하지 않은 상환일입니다"),
	INVALID_MATURITY_DATE(400, "유효하지 않은 만기일입니다"),
	PAST_CONTRACT_DATE(400, "계약일은 과거 날짜로 설정할 수 없습니다"),
	INVALID_CONTRACT_PARTIES(400, "계약 당사자가 동일인입니다"),
	NEGATIVE_LOAN_AMOUNT(400, "대출 금액은 0보다 커야 합니다"),

	// 특약 관련
	SPECIAL_TERM_NOT_FOUND(404, "특약 조항을 찾을 수 없습니다"),
	INVALID_SPECIAL_TERM(400, "유효하지 않은 특약 조항입니다"),
	SPECIAL_TERM_TOO_LONG(400, "특약 조항이 너무 깁니다"),

	// 납부 관련
	PAYMENT_NOT_FOUND(404, "납부 정보를 찾을 수 없습니다"),
	INVALID_PAYMENT_AMOUNT(400, "유효하지 않은 납부 금액입니다"),
	PAYMENT_PROCESSING_ERROR(500, "납부 처리 중 오류가 발생했습니다"),
	PAYMENT_ALREADY_COMPLETED(400, "이미 완료된 납부입니다"),
	EARLY_REPAYMENT_NOT_ALLOWED(400, "현재 계약 상태에서는 중도상환이 불가능합니다"),
	PAYMENT_AMOUNT_BELOW_MINIMUM(400, "최소 납부 금액보다 적습니다"),
	INVALID_PAYMENT_DATE(400, "유효하지 않은 납부일입니다"),
	OVERDUE_AMOUNT_REQUIRED(400, "연체금을 먼저 납부해야 합니다"),

	// 송금 관련
	TRANSFER_NOT_FOUND(404, "송금 정보를 찾을 수 없습니다"),
	TRANSFER_PROCESSING_ERROR(500, "송금 처리 중 오류가 발생했습니다"),
	INVALID_TRANSFER_AMOUNT(400, "유효하지 않은 송금 금액입니다"),
	DUPLICATE_TRANSFER(400, "중복된 송금 요청입니다"),
	TRANSFER_TIME_RESTRICTION(400, "현재 시간에는 송금이 불가능합니다"),
	DAILY_TRANSFER_LIMIT_EXCEEDED(400, "일일 송금 한도를 초과했습니다"),

	// 채팅 관련
	CHAT_NOT_FOUND(404, "채팅을 찾을 수 없습니다"),
	CHAT_SEND_ERROR(500, "채팅 전송 중 오류가 발생했습니다"),
	INVALID_CHAT_CONTENT(400, "유효하지 않은 채팅 내용입니다"),
	CHAT_ROOM_ACCESS_DENIED(403, "채팅방 접근 권한이 없습니다"),
	CHAT_CONTENT_TOO_LONG(400, "채팅 내용이 너무 깁니다"),

	// 알림 관련
	NOTIFICATION_NOT_FOUND(404, "알림을 찾을 수 없습니다"),
	NOTIFICATION_PROCESSING_ERROR(500, "알림 처리 중 오류가 발생했습니다"),
	INVALID_NOTIFICATION_TYPE(400, "유효하지 않은 알림 유형입니다"),
	SSE_CONNECTION_ERROR(500, "알림 연결 중 오류가 발생했습니다"),

	// 계약 관리 관련
	CONTRACT_MANAGEMENT_NOT_FOUND(404, "계약 관리 정보를 찾을 수 없습니다"),
	INVALID_PAYMENT_SCHEDULE(400, "유효하지 않은 납부 일정입니다"),
	SCHEDULE_CALCULATION_ERROR(500, "납부 일정 계산 중 오류가 발생했습니다"),
	OVERDUE_INTEREST_CALCULATION_ERROR(500, "연체 이자 계산 중 오류가 발생했습니다"),

	// 계약 종료 관련
	CONTRACT_TERMINATION_REQUEST_NOT_FOUND(404, "계약 파기 요청을 찾을 수 없습니다"),
	CONTRACT_TERMINATION_NOT_ALLOWED(400, "현재 계약 상태에서는 파기가 불가능합니다"),
	CONTRACT_TERMINATION_ALREADY_REQUESTED(400, "이미 파기 요청이 존재합니다"),
	TERMINATION_APPROVAL_ERROR(500, "파기 승인 처리 중 오류가 발생했습니다"),

	// 외부 API 관련
	EXTERNAL_API_ERROR(500, "외부 API 호출 중 오류가 발생했습니다"),
	SMS_SEND_FAILED(500, "SMS 발송에 실패했습니다"),

	// OAuth2 관련
	OAUTH2_INVALID_TOKEN(401, "유효하지 않은 OAuth2 토큰입니다"),
	OAUTH2_INVALID_REQUEST(400, "잘못된 OAuth2 요청입니다"),
	OAUTH2_UNAUTHORIZED_CLIENT(401, "승인되지 않은 OAuth2 클라이언트입니다"),
	OAUTH2_ACCESS_DENIED(403, "OAuth2 접근이 거부되었습니다"),
	OAUTH2_PROCESSING_ERROR(500, "OAuth2 처리 중 오류가 발생했습니다"),
	INVALID_PROVIDER(400, "유효하지 않은 인증 제공자입니다"),

	// 자산 관련
	ASSET_CALCULATION_ERROR(500, "자산 계산 중 오류가 발생했습니다"),
	ASSET_DATA_NOT_FOUND(404, "자산 데이터를 찾을 수 없습니다"),

	// 마이페이지 관련
	PROFILE_UPDATE_ERROR(500, "프로필 업데이트 중 오류가 발생했습니다"),
	PASSWORD_MISMATCH(400, "새 비밀번호가 일치하지 않습니다"),
	CURRENT_PASSWORD_INCORRECT(400, "현재 비밀번호가 올바르지 않습니다"),
	ADDRESS_NOT_FOUND(404, "주소 정보를 찾을 수 없습니다"),

	// 날짜 관련
	INVALID_DATE_RANGE(400, "유효하지 않은 날짜 범위입니다"),
	START_DATE_AFTER_END_DATE(400, "시작일이 종료일보다 늦을 수 없습니다"),
	DATE_CONVERSION_ERROR(500, "날짜 변환 중 오류가 발생했습니다");

	private final int status;
	private final String message;
}