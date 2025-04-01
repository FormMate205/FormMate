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
		description = "지금까지 보낸 총 금액 + 미래에 보낼 예상 총 금액",
		example = "16000000",
		required = true
	)
	private Long expectedTotalRepayment;

	@Schema(
		description = "받은 총 금액",
		example = "1800000",
		required = true
	)
	private Long receivedAmount;

	@Schema(
		description = "받은 총 금액 + 미래에 받게 될 예상 총 금액",
		example = "5000000",
		required = true
	)
	private Long expectedTotalReceived;
}
