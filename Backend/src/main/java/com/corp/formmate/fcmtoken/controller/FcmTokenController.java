package com.corp.formmate.fcmtoken.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.fcmtoken.dto.FcmTokenCreateRequest;
import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fcm")
@RequiredArgsConstructor
public class FcmTokenController {

	private final FcmTokenService fcmTokenService;

	@PostMapping("/send")
	public ResponseEntity<String> sendTestPush(@RequestParam String token) {
		fcmTokenService.sendMessageTo(token, "테스트 알림", "푸시 알림이 잘 도착했습니다!");
		return ResponseEntity.ok("전송 요청 완료!");
	}

	@PostMapping("/token")
	public ResponseEntity<Boolean> createToken(@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "Fcm 토큰 등록 요청",
			required = true,
			content = @Content(schema = @Schema(implementation = FcmTokenCreateRequest.class))
		)
		@Valid @RequestBody FcmTokenCreateRequest fcmTokenCreateRequest,
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();
		boolean response = fcmTokenService.createToken(userId, fcmTokenCreateRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
}
