package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "주소 수정 요청")
public class AddressUpdateRequest {
    @NotBlank(message = "주소는 필수 입력 항목입니다.")
    @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 123", required = true)
    private String address;

    @Schema(description = "상세 주소", example = "456동 789호")
    private String addressDetail;
}
