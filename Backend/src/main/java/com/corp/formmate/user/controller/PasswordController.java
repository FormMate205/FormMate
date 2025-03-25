package com.corp.formmate.user.controller;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.PasswordFindRequest;
import com.corp.formmate.user.dto.PasswordResetRequest;
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
    public ResponseEntity<String> findPassword(@Valid @RequestBody PasswordFindRequest request) {
        passwordManagerService.sendPasswordResetVerification(
                    request.getUserName(),
                    request.getPhoneNumber()
        );

        return ResponseEntity.status(HttpStatus.OK).body("비밀번호 재설정 인증번호가 전송되었습니다.");
    }

    /**
     * 비밀번호 재설정 (인증번호 확인 및 새 비밀번호 설정)
     */
    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        passwordManagerService.resetPassword(
                request.getPhoneNumber(),
                request.getVerificationCode(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );

        return ResponseEntity.status(HttpStatus.OK).body("비밀번호가 성공적으로 재설정되었습니다.");
    }
}
