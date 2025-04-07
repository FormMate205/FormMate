package com.corp.formmate.transfer.dto;

import com.corp.formmate.transfer.entity.TransferEntity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "송금하기 - 거래 내역 생성 응답")
@Builder
public class TransferCreateResponse {

	@Schema(
		description = "상대방 이름",
		example = "장원영"
	)
	private String userName;

	@Schema(
		description = "송금 금액",
		example = "13000"
	)
	private long amount;

	@Schema(
		description = "납부 내역 상태(연체, 납부, 중도상환)",
		example = "연체"
	)
	private String status;

	public static TransferCreateResponse fromEntity(TransferEntity transfer) {
		return TransferCreateResponse.builder()
			.userName(transfer.getReceiver().getUserName())
			.amount(transfer.getAmount())
			.status(transfer.getStatus().getKorName())
			.build();
	}

}
