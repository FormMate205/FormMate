package com.corp.formmate.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter
@Service
@NoArgsConstructor
public class CodeVerificationRequest {
    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    private String phoneNumber;

    @NotBlank(message = "인증 코드는 필수 입력 항목입니다.")
    private String code;
}
