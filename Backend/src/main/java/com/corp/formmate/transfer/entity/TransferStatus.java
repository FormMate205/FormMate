package com.corp.formmate.transfer.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TransferStatus {
	OVERDUE("연체"),
	PAID("납부"),
	EARLY_REPAYMENT("중도상환");

	private final String korName;

	public static TransferStatus fromKorName(String korName) {
		for (TransferStatus status : TransferStatus.values()) {
			if (status.getKorName().equals(korName)) {
				return status;
			}
		}
		throw new IllegalArgumentException("일치하는 상태값이 없습니다: " + korName);
	}
}
