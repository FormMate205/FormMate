package com.corp.formmate.user.controller;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.CodeVerificationRequest;
import com.corp.formmate.user.dto.PhoneVerificationRequest;
import com.corp.formmate.user.dto.VerificationResponse;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mockito.MockedStatic;
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
    public ResponseEntity<VerificationResponse> requestVerification(@Valid @RequestBody PhoneVerificationRequest request) {
        // 서비스 계층에서 예외 처리 및 결과 반환
        VerificationResponse response = verificationService.requestVerificationCode(
                request.getPhoneNumber(),
                request.isPreferAlimtalk()
        );

        // HTTP 상태 코드 설정 - 성공 또는 요청 제한 (TOO_MANY_REQUESTS)에 따라
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.TOO_MANY_REQUESTS;

        return ResponseEntity.status(status).body(response);
    }

    /**
     * 인증코드 확인 API
     */
    @PostMapping("/verify")
    public ResponseEntity<VerificationResponse> verifyCode(@Valid @RequestBody CodeVerificationRequest request) {
        String phoneNumber = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 인증 검증 (서비스 계층에서 예외 처리)
        VerificationResponse response = verificationService.verifyAndMarkPhoneNumber(phoneNumber, request.getCode());

        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);

    }

}
