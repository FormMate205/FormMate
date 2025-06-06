package com.corp.formmate.contract.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractTransferResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.dto.MonthlyContractDetail;
import com.corp.formmate.contract.dto.TransferFormListResponse;
import com.corp.formmate.contract.service.ContractService;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
	public ResponseEntity<ContractDetailResponse> selectContractDetail(@CurrentUser AuthUser authUser,
		@PathVariable Integer formId) {
		Integer userId = authUser.getId();
		return ResponseEntity.ok(contractService.selectContractDetail(userId, formId));
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
	@GetMapping
	public ResponseEntity<List<ContractPreviewResponse>> selectAllContractByStatus(@RequestParam List<String> status,
		@CurrentUser AuthUser authUser) {
		Integer userId = authUser.getId();
		List<FormStatus> formStatuses = new ArrayList<>();
		for(String st : status) {
			if(st.equals("ALL")) {
				formStatuses.add(FormStatus.BEFORE_APPROVAL);
				formStatuses.add(FormStatus.AFTER_APPROVAL);
				formStatuses.add(FormStatus.IN_PROGRESS);
				formStatuses.add(FormStatus.OVERDUE);
				formStatuses.add(FormStatus.COMPLETED);
			} else {
				formStatuses.add(FormStatus.valueOf(st));
			}
		}

		return ResponseEntity.ok(contractService.selectAllContractByStatus(formStatuses, userId));
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
		Integer userId = authUser.getId();
		return ResponseEntity.ok(contractService.selectAmounts(userId));
	}

	@Operation(summary = "메인화면 납부 계획(내역)", description = "메인화면 달력(과거, 현재, 미래) - 과거면 실제 납부 기록, 미래면 예상 납부 스케줄 반환")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "납부 계획(내역) 조회 성공",
			content = @Content(
				mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = MonthlyContractDetail.class))
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
	@GetMapping("/schedule")
	public ResponseEntity<List<MonthlyContractDetail>> selectMonthlyContracts(
		@CurrentUser AuthUser authUser,
		@RequestParam LocalDate viewDate
	) {
		Integer userId = authUser.getId();
		List<MonthlyContractDetail> details = contractService.selectMonthlyContracts(userId, viewDate);
		return ResponseEntity.ok(details);
	}

	@Operation(
		summary = "계약 상대방 목록 조회",
		description = "현재 유저가 채무자인 계약 중, 다음 납부 예정일이 존재하는 계약 상대방 목록을 반환"
	)
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계약 상대방 목록 조회 성공",
			content = @Content(
				mediaType = "application/json",
				array = @ArraySchema(schema = @Schema(implementation = ContractTransferResponse.class))
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "잘못된 요청 파라미터",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("/forms")
	public ResponseEntity<List<ContractTransferResponse>> selectContractTransfers(
		@CurrentUser AuthUser authUser,
		@RequestParam(required = false) String name
	) {
		Integer userId = authUser.getId();
		List<ContractTransferResponse> responses = contractService.selectContractTransfers(userId, name);
		return ResponseEntity.status(HttpStatus.OK).body(responses);
	}

	@Operation(summary = "차용증 거래내역 조회", description = "특정 차용증의 거래내역을 상태별로 조회합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "차용증 거래내역 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
					value = """
						{
						  "content": [
						    {
						      "status": "납부",
						      "currentRound": 1,
						      "amount": 100000,
						      "paymentDifference": 0,
						      "transactionDate": "2025-03-21 14:30:00"
						    },
						    {
						      "status": "연체",
						      "currentRound": 2,
						      "amount": 90000,
						      "paymentDifference": -10000,
						      "transactionDate": "2025-04-21 16:45:00"
						    }
						  ],
						  "totalElements": 12,
						  "totalPages": 2,
						  "pageable": {
						    "page": 0,
						    "size": 10,
						    "sort": {
						      "sorted": true,
						      "direction": "DESC"
						    }
						  }
						}
						"""
				)
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "잘못된 요청 형식",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		),
		@ApiResponse(
			responseCode = "404",
			description = "차용증을 찾을 수 없음",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("/transfer/{formId}")
	public ResponseEntity<Page<TransferFormListResponse>> selectFormTransfers(
		@Parameter(description = "차용증 ID", required = true, example = "1")
		@PathVariable Integer formId,

		@Parameter(description = "거래 유형 (전체, 연체, 납부, 중도상환)")
		@RequestParam(value = "status", defaultValue = "전체") String status,

		@Parameter(description = "페이징 정보")
		Pageable pageable
	) {

		Page<TransferFormListResponse> responses = contractService.selectFormTransfers(formId,
			status, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(responses);
	}
}
