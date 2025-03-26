package com.corp.formmate.form.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RepaymentMethod {
	EQUAL_PRINCIPAL("원금균등상환"),
	EQUAL_PRINCIPAL_INTEREST("원리금균등상환"),
	PRINCIPAL_ONLY("원금상환");

	private final String korName;

	public static RepaymentMethod fromKorName(String korName) {
		for (RepaymentMethod method : RepaymentMethod.values()) {
			if (method.getKorName().equals(korName)) {
				return method;
			}
		}
		throw new IllegalArgumentException("일치하는 상태값이 없습니다: " + korName);
	}
}
