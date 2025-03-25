package com.corp.formmate.user.controller;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.PasswordFindRequest;
import com.corp.formmate.user.dto.PasswordResetRequest;
import com.corp.formmate.user.dto.PasswordResetResponse;
import com.corp.formmate.user.service.PasswordManagerService;
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
@RequestMapping("/api/auth/paswword")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordManagerService passwordManagerService;

    /**
     * 비밀번호 찾기 요청 (인증번호 발송)
     */
    @PostMapping("/find")
    public ResponseEntity<PasswordResetResponse> findPassword(@Valid @RequestBody PasswordFindRequest request) {
        try {
            // 이름과 전화번호로 사용자 확인 및 인증번호 발송
            PasswordResetResponse response = passwordManagerService.sendPasswordResetVerification(
                    request.getUserName(),
                    request.getPhoneNumber(),
                    true
            );

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (UserException e) {
            if (e.getErrorCode() == ErrorCode.USER_NOT_FOUND) {
                // 사용자를 찾을 수 없는 경우, 보안상 일반적인 메세지 반환
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(PasswordResetResponse.fail("일치하는 사용자 정보를 찾을 수 없습니다."));
            }
            throw e;
        }
    }

    /**
     * 비밀번호 재설정 (인증번호 확인 및 새 비밀번호 설정)
     */
    @PostMapping("/reset")
    public ResponseEntity<PasswordResetResponse> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            // 인증번호 확인 및 비밀번호 재설정
            PasswordResetResponse response = passwordManagerService.resetPassword(
                    request.getPhoneNumber(),
                    request.getVerificationCode(),
                    request.getNewPassword(),
                    request.getConfirmPassword()
            );

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (UserException e) {
            HttpStatus status;

            // 오류 유형에 따라 적절한 HTTP 상태 코드 설정
            if (e.getErrorCode() == ErrorCode.PHONE_VERIFICATION_FAILED) {
                status = HttpStatus.BAD_REQUEST;
            } else if (e.getErrorCode() == ErrorCode.PASSWORD_MISMATCH) {
                status = HttpStatus.BAD_REQUEST;
            } else if (e.getErrorCode() == ErrorCode.PHONE_VERIFICATION_EXPIRED) {
                status = HttpStatus.GONE; // 410 Gone
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }

            return ResponseEntity.status(status).body(PasswordResetResponse.fail(e.getErrorCode().getMessage()));
        }
    }
}
