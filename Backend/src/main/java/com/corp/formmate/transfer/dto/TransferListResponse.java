package com.corp.formmate.transfer.dto;

import java.time.LocalDateTime;

import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.user.entity.UserEntity;
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
public class TransferListResponse {

	@Schema(
		description = "상대방 이름",
		example = "홍길동"
	)
	private String partnerName;

	@Schema(
		description = "거래 타입(출금 or 입금)",
		example = "입금"
	)
	private String type;

	@Schema(
		description = "거래 금액",
		example = "100000"
	)
	private Long amount;

	@Schema(
		description = "거래 날짜",
		example = "2025-03-21T00:00:00"
	)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime transactionDate;

	public static TransferListResponse fromEntity(TransferEntity transfer, UserEntity currentUser) {

		boolean isSender = transfer.getSender().getId().equals(currentUser.getId());
		String type = isSender ? "출금" : "입금";
		String partnerName = isSender
			? transfer.getReceiver().getUserName() // 송금자일 경우 수신자가 상대방
			: transfer.getSender().getUserName();  // 수신자일 경우 송금자가 상대방

		return TransferListResponse.builder()
			.partnerName(partnerName)
			.type(type)
			.amount(transfer.getAmount())
			.transactionDate(transfer.getTransactionDate())
			.build();
	}

}
