package com.corp.formmate.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 비밀번호 재설정 응답 DTO
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetResponse {
    private Boolean success;
    private String message;

    public static PasswordResetResponse success(String message) {
        return new PasswordResetResponse(true, message);
    }

    public static PasswordResetResponse fail(String message) {
        return new PasswordResetResponse(false, message);
    }
}
