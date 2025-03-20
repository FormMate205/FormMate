package com.corp.formmate.contract.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractStatus {
	BEFORE_APPROVAL("상대승인전"),
	AFTER_APPROVAL("상대승인후"),
	IN_PROGRESS("진행중"),
	OVERDUE("연체"),
	COMPLETED("종료");

	private final String korName;
}