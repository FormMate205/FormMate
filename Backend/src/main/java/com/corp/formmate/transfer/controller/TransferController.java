package com.corp.formmate.transfer.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.transfer.dto.TransferFormListResponse;
import com.corp.formmate.transfer.dto.TransferListResponse;
import com.corp.formmate.transfer.service.TransferService;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
@Tag(name = "거래 API", description = "거래내역 API")
public class TransferController {

	private final TransferService transferService;

	@Operation(summary = "유저 거래내역 조회", description = "사용자의 거래내역을 기간, 거래 유형, 정렬 순서별로 조회합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "거래내역 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
					value = """
						{
						  "content": [
							{
							  "partnerName": "홍길동",
							  "type": "출금",
							  "amount": 100000,
							  "transactionDate": "2025-03-21 14:30:00"
							},
							{
							  "partnerName": "김철수",
							  "type": "입금",
							  "amount": 50000,
							  "transactionDate": "2025-03-20 09:15:00"
							}
						  ],
						  "totalElements": 42,
						  "totalPages": 5,
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
			description = "사용자를 찾을 수 없음",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("")
	public ResponseEntity<Page<TransferListResponse>> selectTransfers(
		@CurrentUser AuthUser authUser,

		@Parameter(description = "조회 기간 (1개월, 3개월, yyyyMMdd~yyyyMMdd)", required = true)
		@RequestParam(defaultValue = "1개월") String period,

		@Parameter(description = "거래 유형 (전체, 출금만, 입금만)", required = true)
		@RequestParam String transferType,

		@Parameter(description = "정렬 방향 (최신순, 과거순)", required = true)
		@RequestParam String sortDirection,

		@Parameter(description = "페이징 정보")
		Pageable pageable) {

		Integer userId = authUser.getId();
		Page<TransferListResponse> transferListResponses = transferService.selectTransfers(
			userId, period, transferType, sortDirection, pageable);

		return ResponseEntity.status(HttpStatus.OK).body(transferListResponses);
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
	@GetMapping("/{formId}")
	public ResponseEntity<Page<TransferFormListResponse>> selectFormTransfers(
		@Parameter(description = "차용증 ID", required = true, example = "1")
		@PathVariable Integer formId,

		@Parameter(description = "거래 유형 (전체, 연체, 납부, 중도상환)")
		@RequestParam(value = "transferStatus", defaultValue = "전체") String transferStatus,

		@Parameter(description = "페이징 정보")
		Pageable pageable
	) {

		Page<TransferFormListResponse> transferFormListResponses = transferService.selectFormTransfers(formId,
			transferStatus, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(transferFormListResponses);
	}
}