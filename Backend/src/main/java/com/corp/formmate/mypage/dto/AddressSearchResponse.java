package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter
@Service
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "주소 조회 응답")
public class AddressSearchResponse {
    @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 123")
    private String address;

    @Schema(description = "상세 주소", example = "456동 789호")
    private String addressDetail;
}
