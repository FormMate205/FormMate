package com.corp.formmate.contract.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MonthlyContractDetail {
	@Schema(
		description = "유저가 채권자인지 여부",
		example = "true",
		required = true
	)
	private Boolean userIsCreditor;

	@Schema(
		description = "계약 상대방 이름",
		example = "이동욱",
		required = true
	)
	private String contracteeName;

	@Schema(
		description = "납부 예정(or 납부했던) 금액",
		example = "80000",
		required = true
	)
	private Long repaymentAmount;
}
