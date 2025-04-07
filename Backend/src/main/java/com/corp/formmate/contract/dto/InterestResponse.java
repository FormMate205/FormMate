package com.corp.formmate.contract.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 원금
 * 납부 총 이자 + 납부 연체이자
 * 중도상환수수료
 * 이번 회차 미납 금액
 * 만기일 예상 납부 금액
 * - 그 중 원금
 * - 그 중 이자
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterestResponse {
	@Schema(
		description = "납부한 원금",
		example = "656124",
		required = true
	)
	private Long paidPrincipalAmount;

	@Schema(
		description = "납부한 총 이자",
		example = "25269",
		required = true
	)
	private Long paidInterestAmount;

	@Schema(
		description = "납부한 총 이자 중 연체 이자",
		example = "12345",
		required = true
	)
	private Long paidOverdueInterestAmount;

	@Schema(
		description = "납부한 총 중도상환수수료",
		example = "3567",
		required = true
	)
	private Long totalEarlyRepaymentFee;

	@Schema(
		description = "이번 달(회차) 미납부 금액",
		example = "6124",
		required = true
	)
	private Long unpaidAmount;

	@Schema(
		description = "만기일 예상 납부 금액",
		example = "1656124",
		required = true
	)
	private Long expectedPaymentAmountAtMaturity;

	@Schema(
		description = "만기일 예상 납부 금액 중 원금",
		example = "1000000",
		required = true
	)
	private Long expectedPrincipalAmountAtMaturity;

	@Schema(
		description = "만기일 예상 납부 금액 중 이자",
		example = "25269",
		required = true
	)
	private Long expectedInterestAmountAtMaturity;
}
