package com.corp.formmate.contract.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.contract.dto.ContractDetailDto;
import com.corp.formmate.contract.service.ContractService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contract")
public class ContractController {

	private final ContractService contractService;

	@GetMapping("/{formId}")
	public ResponseEntity<ContractDetailDto> selectContractDetail(@PathVariable Integer formId) {
		return ResponseEntity.ok(contractService.selectContractDetail(formId));
	}
}
