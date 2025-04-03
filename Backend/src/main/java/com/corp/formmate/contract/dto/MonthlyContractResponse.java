package com.corp.formmate.contract.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyContractResponse {
	private List<MonthlyContractDetail> contracts = new ArrayList<>();
}
