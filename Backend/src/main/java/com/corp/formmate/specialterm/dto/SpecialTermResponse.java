package com.corp.formmate.specialterm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "특약 응답")
@Builder
public class SpecialTermResponse {

	@Schema(
		description = "특약 인덱스",
		example = "1"
	)
	private Integer specialTermIndex;

	@Schema(
		description = "특약 상세 내용",
		example = "채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다."
	)
	private String specialTermDetail;
}
