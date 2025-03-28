package com.corp.formmate.contract.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.service.ContractService;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contract")
@Tag(name = "계약관리 API", description = "계약관리 관련 API")
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

	@Operation(summary = "납부 예정 금액 조회(송금 화면)", description = "이번 달 남은 상환 금액(연체액 포함 금액) / 중도상환수수료")
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

	@Operation(summary = "납부 요약", description = "계약관리 페이지 - 납부요약")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "납부 요약 조회 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = InterestResponse.class)
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
	@GetMapping("/{formId}/interest")
	public ResponseEntity<InterestResponse> selectInterest(@PathVariable Integer formId) {
		return ResponseEntity.ok(contractService.selectInterestResponse(formId));
	}

	@Operation(summary = "특정 상대와의 계약 조회", description = "다음 상환 금액, 다음 상환일, 계약 기간 등 (사용자가 채권자, 채무자인 것 모두 반환)")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "특정 상대와의 계약 조회 성공",
			content = @Content(
				mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = ContractWithPartnerResponse.class))
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
	@GetMapping("/remain/{userId}")
	public ResponseEntity<List<ContractWithPartnerResponse>> selectContractWithPartner(@PathVariable Integer userId,
		@CurrentUser
		AuthUser authUser) {
		Integer currentUserId = authUser.getId();
		return ResponseEntity.ok(contractService.selectContractWithPartner(currentUserId, userId));
	}

	// TODO: 계약관리-목록 테스트 코드 작성
	@Operation(summary = "상태별 전체 계약 조회", description = "계약관리-목록 화면")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "상태별 전체 계약 조회 성공",
			content = @Content(
				mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = ContractPreviewResponse.class))
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
	@GetMapping("/{status}")
	public ResponseEntity<List<ContractPreviewResponse>> selectAllContractByStatus(@PathVariable FormStatus formStatus, @CurrentUser AuthUser authUser) {
		return ResponseEntity.ok(contractService.selectAllContractByStatus(formStatus, authUser));
	}

	@Operation(summary = "보낸 금액/받을 금액", description = "계약관리-목록 화면")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "보낸 금액/받을 금액 조회 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = AmountResponse.class)
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
	@GetMapping("/amount")
	public ResponseEntity<AmountResponse> selectAmounts(@CurrentUser AuthUser authUser) {
		return ResponseEntity.ok(contractService.selectAmounts(authUser));
	}
}
