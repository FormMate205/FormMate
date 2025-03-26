package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import com.corp.formmate.contract.entity.ContractEntity;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 계약관리 - 계약 상세 조회 DTO
 * 연체 횟수 + 금액
 * 다음 상환일
 * 중도 상환 횟수 + 수수료
 * 남은 금액
 */
@Data
@NoArgsConstructor
public class ContractDetailResponse {
	private Integer overdueCount;
	private Long overdueAmount;
	private LocalDate nextRepaymentDate;
	private Integer earlyRepaymentCount;
	private Long totalEarlyRepaymentCharge;
	private Long remainingPrincipal;

	public ContractDetailResponse(ContractEntity contract) {
		this.overdueCount = contract.getOverdueCount();
		this.overdueAmount = contract.getOverdueAmount();
		this.nextRepaymentDate = contract.getNextRepaymentDate();
		this.earlyRepaymentCount = contract.getEarlyRepaymentCount();
		this.remainingPrincipal = contract.getRemainingPrincipal();
	}
}
