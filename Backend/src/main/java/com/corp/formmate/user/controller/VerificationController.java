package com.corp.formmate.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/verification")
@RequiredArgsConstructor
public class VerificationController {

    // 인증코드 요청 API
    @PostMapping("/request")
    public ResponseEntity<?> requestVerification(@RequestBody PhoneVerificationRequest request) {
        // 1. 유효한 전화번호인지 검증

        // 2. 인증 코드 생성

        // 3. 카카오톡 알림 시도 (실패 시 SMS로 대체)

        // 4. 응답 반환

    }

    // 인증코드 확인 API
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody CodeVerificationRequest request) {

    }

}
