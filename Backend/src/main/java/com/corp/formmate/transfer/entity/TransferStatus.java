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
}
