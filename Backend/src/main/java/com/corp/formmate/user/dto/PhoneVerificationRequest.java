package com.corp.formmate.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 휴대폰 인증 코드 요청 DTO
 */
@Getter
@Service
@NoArgsConstructor
@AllArgsConstructor
public class PhoneVerificationRequest {
    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    private String phoneNumber;

    // 카카오톡 알림톡 선호 여부 (기본값: true)
    private boolean preferKakao = true;
}
