package com.corp.formmate.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 인증 관련 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {

    private boolean success;
    private String message;

    /**
     * 성공 응답 생성
     */
    public static VerificationResponse success(String message) {
        return new VerificationResponse(true, message);
    }

    /**
     * 실패 응답 생성
     */
    public static VerificationResponse fail(String message) {
        return new VerificationResponse(false, message);
    }
}
