package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 재설정 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "비밀번호 재설정 요청")
public class PasswordResetRequest {
    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    @Schema(description = "전화번호", example = "01012345678", required = true)
    private String phoneNumber;

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