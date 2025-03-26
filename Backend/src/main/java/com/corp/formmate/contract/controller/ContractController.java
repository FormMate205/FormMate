package com.corp.formmate.contract.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.service.ContractService;
import com.corp.formmate.global.error.dto.ErrorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contract")
public class ContractController {

	// TODO: Input값 valid 추가
	private final ContractService contractService;

	@Operation(summary = "계약 상세 조회", description = "계약 상세 페이지 상단 내용(연체 횟수 / 연체 금액 / 다음 상환일 / 중도상환 횟수 / 중도상환 수수료 / 남은 금액)")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계약 상세 조회 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ContractDetailResponse.class)
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "잘못된 입력값",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("/{formId}")
	public ResponseEntity<ContractDetailResponse> selectContractDetail(@PathVariable Integer formId) {
		return ResponseEntity.ok(contractService.selectContractDetail(formId));
	}

	@Operation(summary = "납부 예정 금액 조회", description = "이번 달 남은 상환 금액(연체액 포함 금액) / 중도상환수수료")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "납부 예정 금액 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ExpectedPaymentAmountResponse.class)
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "잘못된 입력값",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("/{formId}/cost")
	public ResponseEntity<ExpectedPaymentAmountResponse> selectExpectedPaymentAmount(@PathVariable Integer formId) {
		return ResponseEntity.ok(contractService.selectExpectedPaymentAmount(formId));
	}

	@GetMapping("/{formId}/interest")
	public ResponseEntity<InterestResponse> selectInterest(@PathVariable Integer formId) {
		return ResponseEntity.ok(contractService.selectInterestResponse(formId));
	}
}
