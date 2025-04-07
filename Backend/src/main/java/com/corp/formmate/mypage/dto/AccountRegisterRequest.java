package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계좌 등록 요청")
public class AccountRegisterRequest {
    @NotBlank(message = "인증 번호는 필수 입력 항목입니다.")
    @Schema(description = "인증 번호", example = "1234", required = true)
    private String verificationCode;

    @NotBlank(message = "은행 이름은 필수 입력 항목입니다.")
    @Schema(description = "은행 이름", example = "한국은행", required = true)
    private String bankName;

    @NotBlank(message = "계좌 번호는 필수 입력 항목입니다.")
    @Schema(description = "계좌 번호", example = "1112222233333", required = true)
    private String accountNumber;

    @NotBlank(message = "계좌 비밀번호는 필수 입력 항목입니다.")
    @Schema(description = "계좌 비밀번호", example = "123456", required = true)
    private String accountPassword;
}
