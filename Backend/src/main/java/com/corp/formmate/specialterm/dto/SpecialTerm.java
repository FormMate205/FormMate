package com.corp.formmate.specialterm.dto;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SpecialTerm {
	LEGAL_ACTION(1, "채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다."),
	USAGE_RESTRICTION(2, "빌려간 돈을 특정 용도로 사용해야 하며, 도박 등 부적절한 용도로 사용할 수 없습니다."),
	DISPUTE_RESOLUTION(3, "계약과 관련한 분쟁이 발생할 경우 대한민국 법률을 따릅니다."),
	COST_BURDEN(4, "채무자가 계약을 지키지 않을 경우, 발생하는 법적 비용은 채무자가 부담해야 합니다.");

	private final int specialTermIndex;
	private final String specialTermDetail;

	SpecialTerm(int specialTermIndex, String specialTermDetail) {
		this.specialTermIndex = specialTermIndex;
		this.specialTermDetail = specialTermDetail;
	}

	public int getSpecialTermIndex() {
		return specialTermIndex;
	}

	public String getSpecialTermDetail() {
		return specialTermDetail;
	}

	@JsonValue
	public int toValue() {
		return specialTermIndex;
	}

	public static SpecialTerm getByIndex(int index) {
		for (SpecialTerm term : values()) {
			if (term.getSpecialTermIndex() == index) {
				return term;
			}
		}
		return null;
	}

	public static List<SpecialTerm> getByIndexes(List<Integer> indexes) {
		if (indexes == null) {
			return Collections.emptyList();
		}
		return indexes.stream()
			.map(SpecialTerm::getByIndex)
			.filter(Objects::nonNull)
			.collect(Collectors.toList());
	}
}