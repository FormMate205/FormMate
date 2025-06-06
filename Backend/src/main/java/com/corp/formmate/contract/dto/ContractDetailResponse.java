package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 계약관리 - 계약 상세 조회 DTO
 * 연체 횟수 + 금액
 * 다음 상환일
 * 중도 상환 횟수 + 수수료
 * 남은 금액
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContractDetailResponse {

	@Schema(
		description = "사용자가 채권자인지 여부",
		example = "true",
		required = true
	)
	private boolean userIsCreditor;

	@Schema(
		description = "계약 상대방 이름",
		example = "강지은",
		required = true
	)
	private String contracteeName;

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
		description = "현재 연체액(연채액 + 이자)",
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
		description = "현재까지 납부한 금액",
		example = "48000",
		required = true
	)
	private Long repaymentAmount;

	@Schema(
		description = "남은 금액",
		example = "52000",
		required = true
	)
	private Long remainingPrincipal;

}
