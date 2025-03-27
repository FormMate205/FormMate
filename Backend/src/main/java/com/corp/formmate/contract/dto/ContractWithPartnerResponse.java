package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 다음 상환 금액, 다음 상환일, 계약 기간 등 (사용자가 채권자, 채무자인 것 모두 반환)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractWithPartnerResponse {
	@Schema(
		description = "사용자가 채권자인 계약인지 여부",
		example = "true",
		required = true
	)
	private boolean userIsCreditor;

	@Schema(
		description = "다음 상환 금액",
		example = "10000",
		required = true
	)
	private Long nextRepaymentAmount;

	@Schema(
		description = "다음 상환일",
		example = "2025-03-27",
		required = true
	)
	private LocalDate nextRepaymentDate;

	@Schema(
		description = "계약 기간",
		example = "2024.01.01 ~ 2025.10.10",
		required = true
	)
	private String contractDuration;
}
