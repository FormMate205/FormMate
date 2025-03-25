package com.corp.formmate.user.controller;

import com.corp.formmate.user.dto.CodeVerificationRequest;
import com.corp.formmate.user.dto.PhoneVerificationRequest;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final MessageService messageService;

    /**
     * 휴대폰 인증 코드 요청 API
     */
    @PostMapping("/request")
    public ResponseEntity<String> requestVerification(@Valid @RequestBody PhoneVerificationRequest request) {
        // 서비스 계층에서 예외 처리 및 결과 반환
        verificationService.requestVerificationCode(request.getPhoneNumber());

        // 성공시 200 OK
        return ResponseEntity.status(HttpStatus.OK).body("인증코드가 발송되었습니다.");
    }

    /**
     * 인증코드 확인 API
     */
    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@Valid @RequestBody CodeVerificationRequest request) {
        String phoneNumber = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 인증 검증 (서비스 계층에서 예외 처리)
        verificationService.verifyAndMarkPhoneNumber(phoneNumber, request.getCode());

        return ResponseEntity.status(HttpStatus.OK).body("인증이 완료되었습니다.");
    }
}
