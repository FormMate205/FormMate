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
     * @param request
     * @return
     */
    @PostMapping("/request")
    public ResponseEntity<VerificationResponse> requestVerification(@Valid @RequestBody PhoneVerificationRequest request) {
        VerificationResponse response = verificationService.requestVerificationCode(
                request.getPhoneNumber(),
                request.isPreferAlimtalk()
        );

        // HTTP 상태 코드 설정 - 성공 또는 요청 제한 (TOO_MANY)REQUESTS)에 따라
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.TOO_MANY_REQUESTS;

        return ResponseEntity.status(status).body(response);
    }

    /**
     * 인증코드 확인 API
     */
    @PostMapping("/verify")
    public ResponseEntity<VerificationResponse> verifyCode(@Valid @RequestBody CodeVerificationRequest request) {
        String phoneNumber = messageService.normalizePhoneNumber(request.getPhoneNumber());

        boolean isValid = verificationService.verifyCode(phoneNumber, request.getCode());

        if (isValid) {
            // 인증 성공 시 해당 전화번호를 인증 완료 상태로 표시
            verificationService.markAsVerified(phoneNumber);
            return ResponseEntity.status(HttpStatus.OK).body(VerificationResponse.success("인증이 완료되었습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(VerificationResponse.fail("인증 코드가 유효하지 않거나 만료되었습니다."));
        }
    }

}
