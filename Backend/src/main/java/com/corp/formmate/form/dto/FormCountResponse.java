package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "특정 유저의 계약 상태별 개수 조회 API")
@Builder
public class FormCountResponse {

	@Schema(
		description = "대기중인 계약서 개수 (상대승인전, 상대승인후 상태의 합계)",
		example = "5"
	)
	private Integer formPendingCount;

	@Schema(
		description = "진행중인 계약서 개수 (진행중 상태)",
		example = "3"
	)
	private Integer formActiveCount;

	@Schema(
		description = "완료된 계약서 개수 (종료 상태)",
		example = "8"
	)
	private Integer formCompletedCount;
}
