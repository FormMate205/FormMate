package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "로그인 요청")
public class LoginRequest {
    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    @Schema(description = "이메일", example = "user@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Schema(description = "비밀번호", example = "Password123!", required = true, minLength = 8, maxLength = 20)
    private String password;
}
