package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "비밀번호 재설정 요청")
public class PasswordUpdateRequest {
    @NotBlank(message = "현재 비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).*$",
            message = "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다.")
    @Schema(
            description = "현재 비밀번호",
            example = "Password123!",
            required = true,
            minLength = 8,
            maxLength = 20
    )
    private String password;

    @NotBlank(message = "새 비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).*$",
            message = "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다.")
    @Schema(
            description = "새 비밀번호",
            example = "NewPassword123!",
            required = true,
            minLength = 8,
            maxLength = 20
    )
    private String newPassword;

    @NotBlank(message = "비밀번호 확인은 필수 입력 항목입니다.")
    @Schema(
            description = "비밀번호 확인",
            example = "NewPassword123!",
            required = true
    )
    private String confirmPassword;
}
