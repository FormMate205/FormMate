package com.corp.formmate.contract.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 원금
 * 납부 총 이자 + 납부 연체이자 (총 이자는 두 개 더해야 함)
 * 중도상환수수료
 * 이번 회차 미납 금액
 * 만기일 예상 납부 금액
 * - 그 중 원금
 * - 그 중 이자
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterestResponse {
	private Long paidPrincipalAmount;
	private Long paidInterestAmount;
	private Long paidOverdueInterestAmount;
	private Long unpaidAmount;
	private Long expectedPaymentAmountAtMaturity;
	private Long expectedPrincipalAmountAtMaturity;
	private Long expectedInterestAmountAtMaturity;
}
