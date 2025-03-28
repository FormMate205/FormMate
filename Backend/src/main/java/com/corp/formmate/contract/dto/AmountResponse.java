package com.corp.formmate.contract.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AmountResponse {
	@Schema(
		description = "보낸 총 금액",
		example = "10000000",
		required = true
	)
	private Long paidAmount;

	@Schema(
		description = "받은 총 금액",
		example = "1800000",
		required = true
	)
	private Long receivedAmount;
}
