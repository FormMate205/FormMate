package com.corp.formmate.contract.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 계약관리 - 납부 예정 금액 조회 DTO
 * 이번 달 남은 상환 금액 + 중도 상환 수수료
 * 남은 상환 금액 -> 이번 달 것만 보는 게 아닌 연체 금액 포함
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpectedPaymentAmountResponse {

	@Schema(
		description = "이번 달(회차) 남은 상환 금액",
		example = "200000",
		required = true
	)
	private Long monthlyRemainingPayment;

	@Schema(
		description = "중도상환 수수료",
		example = "0.5",
		required = true
	)
	private BigDecimal earlyRepaymentFeeRate;
}
