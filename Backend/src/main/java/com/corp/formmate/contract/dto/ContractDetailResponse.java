package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import com.corp.formmate.contract.entity.ContractEntity;

import io.swagger.v3.oas.annotations.media.Schema;
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

	@Schema(
		description = "연체 횟수",
		example = "1",
		required = true
	)
	private Integer overdueCount;

	@Schema(
		description = "연체 제한 횟수(기한이익상실이 발동되는 연체 횟수)",
		example = "3",
		required = true
	)
	private Integer overdueLimit;

	@Schema(
		description = "현재 연체액",
		example = "110000",
		required = true
	)
	private Long overdueAmount;

	@Schema(
		description = "다음 상환일",
		example = "2025-03-27",
		required = true
	)
	private LocalDate nextRepaymentDate;

	@Schema(
		description = "중도 상환 횟수",
		example = "2",
		required = true
	)
	private Integer earlyRepaymentCount;

	@Schema(
		description = "납부한 총 중도상환수수료",
		example = "3567",
		required = true
	)
	private Long totalEarlyRepaymentCharge;

	@Schema(
		description = "남은 금액",
		example = "52000",
		required = true
	)
	private Long remainingPrincipal;

	public ContractDetailResponse(ContractEntity contract) {
		this.overdueCount = contract.getOverdueCount();
		this.overdueAmount = contract.getOverdueAmount();
		this.nextRepaymentDate = contract.getNextRepaymentDate();
		this.earlyRepaymentCount = contract.getEarlyRepaymentCount();
		this.remainingPrincipal = contract.getRemainingPrincipal();
	}
}
