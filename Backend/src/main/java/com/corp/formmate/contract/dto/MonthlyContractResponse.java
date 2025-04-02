package com.corp.formmate.contract.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class MonthlyContractResponse {
	private List<MonthlyContractDetail> contracts = new ArrayList<>();
}
