package com.corp.formmate.global.error.dto;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;

import com.corp.formmate.global.error.code.ErrorCode;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "API 에러 응답")
public class ErrorResponse {
	@Schema(description = "에러 발생 시간", example = "2024-01-23T10:00:00")
	private final LocalDateTime timestamp = LocalDateTime.now();

	@Schema(description = "HTTP 상태 코드", example = "400")
	private final int status;

	@Schema(description = "에러 메시지", example = "유효하지 않은 값입니다.")
	private final String message;

	public static ResponseEntity<ErrorResponse> of(ErrorCode errorCode) {
		ErrorResponse response = ErrorResponse.builder()
			.status(errorCode.getStatus())
			.message(errorCode.getMessage())
			.build();

		return ResponseEntity
			.status(errorCode.getStatus())
			.body(response);
	}
}
