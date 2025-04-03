package com.corp.formmate.form.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FormStatus {
	BEFORE_APPROVAL("상대승인전"),
	AFTER_APPROVAL("상대승인후"),
	IN_PROGRESS("진행중"),
	OVERDUE("연체"),
	COMPLETED("종료");

	private final String korName;

	public static FormStatus fromKorName(String korName) {
		for (FormStatus status : FormStatus.values()) {
			if (status.getKorName().equals(korName)) {
				return status;
			}
		}
		throw new IllegalArgumentException("일치하는 상태값이 없습니다: " + korName);
	}
}