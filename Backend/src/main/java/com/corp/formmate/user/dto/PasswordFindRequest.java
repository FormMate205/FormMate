package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 찾기 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "비밀번호 찾기 요청")
public class PasswordFindRequest {
    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    @Schema(description = "사용자 이름", example = "홍길동", required = true)
    private String userName;

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    @Schema(description = "전화번호", example = "01012345678", required = true)
    private String phoneNumber;
}
