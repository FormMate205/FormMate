package com.corp.formmate.contract.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RepaymentMethod {
	EQUAL_PRINCIPAL("원금균등상환"),
	EQUAL_PRINCIPAL_INTEREST("원리금균등상환"),
	PRINCIPAL_ONLY("원금상환");

	private final String korName;
}
