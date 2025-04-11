package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContractTransferResponse {

	@Schema(
		description = "계약 ID",
		example = "1"
	)
	private Integer formId;

	@Schema(
		description = "파트너 유저 ID",
		example = "10"
	)
	private Integer partnerId;

	@Schema(
		description = "계약 상대방 이름",
		example = "강지은"
	)
	private String partnerName;

	@Schema(
		description = "다음 상환 날짜",
		example = "2025-05-15"
	)
	private LocalDate nextRepaymentDate;

}
