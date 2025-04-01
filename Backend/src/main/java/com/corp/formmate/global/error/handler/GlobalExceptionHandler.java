package com.corp.formmate.global.error.handler;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.global.error.exception.BusinessException;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	// 비즈니스 예외 처리
	@Tag(name = "Error Responses")
	@Schema(name = "BusinessException Response")
	@ExceptionHandler(BusinessException.class)
	protected ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
		ErrorCode errorCode = ex.getErrorCode();
		log.error("[{}] {} - {}.{}",
			errorCode.name(),
			errorCode.getMessage(),
			ex.getStackTrace()[0].getClassName(),
			ex.getStackTrace()[0].getMethodName()
		);

		return ErrorResponse.of(errorCode);
	}

	// Validation 예외 처리
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
		log.error("MethodArgumentNotValidException: {}", ex.getMessage());

		// 유효성 검사 오류 메시지를 모아서 하나의 메시지로 만들기
		String errorMessage = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(error -> error.getField() + ": " + error.getDefaultMessage())
			.collect(Collectors.joining(", "));

		// INVALID_INPUT_VALUE에 해당하는 ErrorCode가 있다고 가정
		ErrorResponse response = ErrorResponse.builder()
			.status(HttpStatus.BAD_REQUEST.value())
			.message(errorMessage.isEmpty() ? "유효하지 않은 입력 값입니다." : errorMessage)
			.build();

		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(response);
	}

	// 나머지 예외 처리
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<ErrorResponse> handleException(Exception ex) {
		log.error("Exception: {}", ex.getMessage());

		return ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
	}

	// 인증 실패 예외 처리
	@ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
	protected ResponseEntity<ErrorResponse> handleAuthenticationCredentialsNotFoundException(
		AuthenticationCredentialsNotFoundException ex) {
		log.warn("Authentication failed: {}", ex.getMessage());

		ErrorResponse response = ErrorResponse.builder()
			.status(HttpStatus.UNAUTHORIZED.value())
			.message("로그인이 필요합니다.") // 혹은 ex.getMessage() 그대로 반환해도 돼
			.build();

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	@ExceptionHandler(BadCredentialsException.class)
	protected ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
		log.warn("Bad credentials: {}", ex.getMessage());
		return ErrorResponse.of(ErrorCode.LOGIN_BAD_CREDENTIALS);
	}

}

