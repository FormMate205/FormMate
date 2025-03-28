package com.corp.formmate.contract.dto;

import java.time.LocalDate;

import com.corp.formmate.form.entity.FormStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 계약 상태(대기, 진행, 연체, 종료)
 * 계약자 이름
 * 계약 만기일
 * 이번 달 보낼 금액
 * 지금까지 상환한 총액
 * 상환 총액(지금까지 상환 금액 + 만기일 예상 납부 금액)
 */
@Data
public class ContractPreviewResponse {

	@Schema(
		description = "계약 상태",
		example = "BEFORE_APPROVAL",
		required = true
	)
	private FormStatus status;

	@Schema(
		description = "사용자가 채권자인지 여부",
		example = "true",
		required = true
	)
	private boolean userIsCreditor;

	@Schema(
		description = "계약 상대 이름",
		example = "강지은",
		required = true
	)
	private String contracteeName;

	@Schema(
		description = "계약 만기일",
		example = "2025-03-28",
		required = true
	)
	private LocalDate maturityDate;

	@Schema(
		description = "이번 달 보낼 금액(=이번 회차 미납 금액)",
		example = "150000",
		required = true
	)
	private Long nextRepaymentAmount;

	@Schema(
		description = "지금까지 상환한 총 금액",
		example = "800000",
		required = true
	)
	private Long totalRepaymentAmount;

	@Schema(
		description = "상환 총 금액(지금까지 상환 금액 + 만기일 예상 납부 총 금액)",
		example = "1500000",
		required = true
	)
	private Long totalAmountDue;
}
