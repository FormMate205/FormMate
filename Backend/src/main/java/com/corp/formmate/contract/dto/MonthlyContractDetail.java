package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyContractDetail {
	
	@Schema(
		description = "유저가 채권자인지 여부",
		example = "true"
	)
	private Boolean userIsCreditor;

	@Schema(
		description = "계약 상대방 이름",
		example = "이동욱"
	)
	private String contracteeName;

	@Schema(
		description = "납부 예정(or 납부했던) 금액",
		example = "80000"
	)
	private Long repaymentAmount;

	@Schema(
		description = "회차 납부 예정일 (yyyy-MM-dd)",
		example = "2023-05-10")
	private LocalDate scheduledPaymentDate;
}
