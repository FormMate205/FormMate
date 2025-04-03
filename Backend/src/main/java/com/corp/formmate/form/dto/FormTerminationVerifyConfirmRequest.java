package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * 계약 파기 인증 확인 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 파기 인증 확인")
public class FormTerminationVerifyConfirmRequest {

    @Schema(description = "전화번호", example = "01012345678", required = true)
    @NotBlank(message = "전화번호는 필수입니다")
    private String phoneNumber;

    @Schema(description = "인증번호", example = "123456", required = true)
    @NotBlank(message = "인증번호는 필수입니다")
    private String verificationCode;

    @NotBlank(message = "reCAPTCHA 토큰은 필수 입력 항목입니다.")
    @Schema(description = "reCAPTCHA 토큰", example = "03AGdBq24PBgaJFuQxxxx...", required = true)
    private String recaptchaToken;
}
