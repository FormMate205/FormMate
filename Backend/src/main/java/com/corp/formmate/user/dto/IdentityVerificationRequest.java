package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "본인인증 요청")
public class IdentityVerificationRequest {
    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    @Schema(description = "사용자 이름", example = "홍길동", required = true)
    private String userName;

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    @Schema(description = "전화번호", example = "01012345678", required = true)
    private String phoneNumber;

    @NotBlank(message = "인증 코드는 필수 입력 항목입니다.")
    @Pattern(regexp = "^[0-9]{6}$", message = "인증 코드는 6자리 숫자여야 합니다.")
    @Schema(description = "인증 코드", example = "123456", required = true)
    private String verificationCode;

    @NotBlank(message = "reCAPTCHA 토큰은 필수 입력 항목입니다.")
    @Schema(description = "reCAPTCHA 토큰", example = "03AGdBq24PBgaJFuQxxxx...", required = true)
    private String recaptchaToken;
}
