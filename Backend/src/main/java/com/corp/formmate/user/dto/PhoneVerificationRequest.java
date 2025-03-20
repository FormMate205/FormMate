package com.corp.formmate.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter
@Service
@NoArgsConstructor
public class PhoneVerificationRequest {
    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    private String phoneNumber;

    // 선택적으로 카카오톡/SMS 선호도 설정 가능
    private String perferredMethod = "kakaotalk";
}
