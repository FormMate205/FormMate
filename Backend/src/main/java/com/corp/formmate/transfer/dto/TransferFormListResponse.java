package com.corp.formmate.transfer.dto;

import java.time.LocalDateTime;

import com.corp.formmate.transfer.entity.TransferEntity;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "유저 거래내역 응답")
@Builder
public class TransferFormListResponse {

	@Schema(
		description = "납부 내역 상태(연체, 납부, 중도상환)",
		example = "연체"
	)
	private String status;

	@Schema(
		description = "거래 시점의 회차",
		example = "1"
	)
	private Integer currentRound;

	@Schema(
		description = "거래 금액",
		example = "100000"
	)
	private Long amount;

	@Schema(
		description = "금액 차이(양수면 초과, 0이면 정상납부, 음수면 미납)",
		example = "-100000"
	)
	private Long paymentDifference;

	@Schema(
		description = "거래 날짜",
		example = "2025-03-21T00:00:00"
	)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime transactionDate;

	public static TransferFormListResponse fromEntity(TransferEntity transfer) {
		return TransferFormListResponse.builder()
			.status(transfer.getStatus().getKorName())
			.currentRound(transfer.getCurrentRound())
			.amount(transfer.getAmount())
			.paymentDifference(transfer.getPaymentDifference())
			.transactionDate(transfer.getTransactionDate())
			.build();
	}
}