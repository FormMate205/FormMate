package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * OAuth2 로그인 후 추가 정보(주소, 전화번호) 입력을 위한 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "프로필 업데이트 요청")
public class ProfileCompletionRequest {
    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    @Schema(description = "전화번호", example = "01012345678", required = true)
    private String phoneNumber;

    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 123", required = true)
    private String address;

    @Schema(description = "상세 주소", example = "456동 789호")
    private String addressDetail;
}
