package com.corp.formmate.fcmtoken.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.fcmtoken.dto.FcmTokenRequest;
import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fcmtoken")
@RequiredArgsConstructor
public class FcmTokenController {

	private final FcmTokenService fcmTokenService;

	/*
	 * 1. 최초 회원 가입 시 알림 설정 default true로 만들어버리자
	 * 2. 로그인 시 디바이스 토큰 떤져주고 백엔드에서 관리
	 * 3. 마이페이지 - 알림 설정 토글 관리 (OFF -> ON token 발급해서 던져줘야함), (ON -> OFF 일때는 삭제 API 호출)
	 * 4. 로그아웃 시 isLogged 관리만 하면 되겠네
	 *
	 */

	// 테스트 메서드
	@Operation(summary = "테스트 알림 전송", description = "현재 로그인된 사용자에게 테스트 푸시 알림을 전송합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "테스트 알림 전송 성공"),
		@ApiResponse(responseCode = "400", description = "푸시 전송 실패")
	})
	@PostMapping("/test-send")
	public ResponseEntity<String> sendTestPush(@RequestBody @Valid FcmTokenRequest tokenRequest) {
		fcmTokenService.sendTestMessageTo(tokenRequest, "테스트 알림", "푸시 알림이 잘 도착했습니다!");
		return ResponseEntity.ok("전송 요청 완료!");
	}

	@Operation(summary = "알림 활성화", description = "알림 설정을 활성화(ON)합니다. FCM 토큰이 필요합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "알림 활성화 성공",
			content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean"))),
		@ApiResponse(responseCode = "400", description = "잘못된 입력값",
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	@PatchMapping("/activate")
	public ResponseEntity<Boolean> activateToken(@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "Fcm 토큰 요청",
			required = true,
			content = @Content(schema = @Schema(implementation = FcmTokenRequest.class))
		)
		@Valid @RequestBody FcmTokenRequest fcmTokenRequest,
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();
		boolean response = fcmTokenService.activateToken(userId, fcmTokenRequest);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Operation(summary = "알림 비활성화", description = "알림 설정을 비활성화(OFF)합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "알림 비활성화 성공",
			content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean"))),
		@ApiResponse(responseCode = "404", description = "FCM 토큰을 찾을 수 없음",
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	@PatchMapping("/deactivate")
	public ResponseEntity<Boolean> deactivateToken(
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();
		boolean response = fcmTokenService.deactivateToken(userId);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Operation(summary = "FCM 토큰 갱신", description = "알림이 ON 상태일 때 FCM 토큰을 갱신합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "토큰 갱신 성공",
			content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean"))),
		@ApiResponse(responseCode = "400", description = "잘못된 토큰",
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	@PatchMapping("/refresh")
	public ResponseEntity<Boolean> refreshToken(@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "Fcm 토큰 요청",
			required = true,
			content = @Content(schema = @Schema(implementation = FcmTokenRequest.class))
		)
		@Valid @RequestBody FcmTokenRequest fcmTokenRequest,
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();
		boolean response = fcmTokenService.refreshToken(userId, fcmTokenRequest);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Operation(summary = "알림 설정 여부 확인", description = "현재 로그인된 사용자의 알림 설정이 활성화되어 있는지 확인합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "조회 성공 (알림 활성화 상태 = true, 알림 비활성화 상태 = false 반환)",
			content = @Content(mediaType = "application/json", schema = @Schema(type = "boolean"))),
		@ApiResponse(responseCode = "404", description = "FCM 토큰을 찾을 수 없음",
			content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
	})
	@GetMapping("")
	public ResponseEntity<Boolean> isActiveToken(
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();
		boolean response = fcmTokenService.isActiveToken(userId);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
