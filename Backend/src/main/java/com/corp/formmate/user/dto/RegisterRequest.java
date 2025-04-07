package com.corp.formmate.user.dto;

import com.corp.formmate.user.entity.Provider;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회원가입 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "회원가입 요청")
public class RegisterRequest {
    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    @Schema(description = "이메일", example = "user@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).*$",
            message = "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다.")
    @Schema(
            description = "비밀번호",
            example = "Password123!",
            required = true,
            minLength = 8,
            maxLength = 20
    )
    private String password;

    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    @Schema(
            description = "사용자 이름",
            example = "홍길동",
            required = true,
            minLength = 2,
            maxLength = 50
    )
    private String userName;

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    @Schema(description = "전화번호", example = "01012345678", required = true)
    private String phoneNumber;

    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 123", required = true)
    private String address;

    @Schema(description = "상세 주소", example = "456동 789호")
    private String addressDetail;

    @Schema(description = "가입 제공자", example = "LOCAL", defaultValue = "LOCAL")
    private Provider provider = Provider.LOCAL;
}
