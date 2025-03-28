package com.corp.formmate.transfer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "송금하기 - 거래 내역 생성 요청")
public class TransferCreateRequest {

	@Schema(
		description = "상대방 유저 ID",
		example = "2",
		required = true
	)
	private Integer partnerId;

	@Schema(
		description = "계약서 ID",
		example = "10",
		required = true
	)
	private Integer formId;

	@Schema(
		description = "상환 예정액",
		example = "1000000"
	)
	private Long repaymentAmount;

	@Schema(
		description = "송금 금액",
		example = "12000000"
	)
	private Long amount;
}
