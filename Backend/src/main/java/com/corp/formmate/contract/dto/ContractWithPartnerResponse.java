package com.corp.formmate.contract.dto;

import java.time.LocalDate;

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
	private boolean userIsCreditor;
	private Long nextRepaymentAmount;
	private LocalDate nextRepaymentDate;
	private String contractDuration;
}
