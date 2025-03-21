package com.corp.formmate.contract.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 계약관리 - 납부 예정 금액 조회 DTO
 * 이번 달 남은 상환 금액 + 중도 상환 수수료
 * 남은 상환 금액 -> 이번 달 것만 보는 게 아닌 연체 금액 포함
 */
@Data
public class ExpectedPaymentAmountDto {
	private Long monthlyRemainingPayment;
	private BigDecimal earlyRepaymentFeeRate;
}
