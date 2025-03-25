package com.corp.formmate.form.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.form.dto.FormCreateRequest;
import com.corp.formmate.form.dto.FormDetailResponse;
import com.corp.formmate.form.dto.FormListResponse;
import com.corp.formmate.form.dto.FormUpdateRequest;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.service.FormService;
import com.corp.formmate.form.service.PaymentPreviewService;
import com.corp.formmate.global.error.dto.ErrorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/form")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "차용증 API", description = "차용증 관련 API")
public class FormController {

	private final FormService formService;

	private final PaymentPreviewService paymentPreviewService;

	@Operation(summary = "차용증 상세 조회", description = "차용증 ID를 이용하여 상세 정보를 조회합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "차용증 조회 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = FormDetailResponse.class)
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
	public ResponseEntity<FormDetailResponse> selectFormById(
		@Parameter(description = "차용증 ID", required = true, example = "1")
		@PathVariable Integer formId) {
		log.info("차용증 상세 조회: id={}", formId);
		return ResponseEntity.status(HttpStatus.OK).body(formService.selectFormById(formId));
	}

	@Operation(summary = "차용증 목록 조회", description = "로그인한 사용자의 차용증 목록을 상태별로 조회하고 이름으로 필터링합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "차용증 목록 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
					value = """
						{
						  "content": [
						    {
						      "formId": 1,
						      "formStatus": "진행중",
						      "receiverName": "홍길동"
						    },
						    {
						      "formId": 2,
						      "formStatus": "연체",
						      "receiverName": "김철수"
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
			responseCode = "404",
			description = "차용증을 찾을 수 없음",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("")
	public ResponseEntity<Page<FormListResponse>> selectForms(
		@Parameter(description = "상태 필터 (전체, 진행중, 연체, 종료)", example = "전체")
		@RequestParam(defaultValue = "전체") String status,
		@Parameter(description = "이름 검색 (채권자 또는 채무자)", example = "홍길동")
		@RequestParam(required = false) String name,
		@Parameter(description = "페이징 정보")
		Pageable pageable) {

		Integer currentUserId = 1;
		log.info("차용증 목록 조회 - 상태: {}, 이름: {}, 페이지: {}, 크기: {}",
			status, name, pageable.getPageNumber(), pageable.getPageSize());
		return ResponseEntity.status(HttpStatus.OK)
			.body(formService.selectForms(currentUserId, status, name, pageable));
	}

	@Operation(summary = "차용증 생성", description = "새로운 차용증을 생성합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "201",
			description = "차용증 생성 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = FormDetailResponse.class)
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
	@PostMapping("")
	public ResponseEntity<FormDetailResponse> createForm(@io.swagger.v3.oas.annotations.parameters.RequestBody(
		description = "차용증 생성 정보",
		required = true,
		content = @Content(schema = @Schema(implementation = FormCreateRequest.class))
	)
	@Valid @RequestBody FormCreateRequest formCreateRequest) {
		Integer currentUserId = 1;
		log.info("차용증 생성 요청 - 채권자ID: {}, 채무자ID: {}",
			formCreateRequest.getCreditorId(), formCreateRequest.getDebtorId());
		return ResponseEntity.status(HttpStatus.CREATED).body(formService.createForm(currentUserId, formCreateRequest));
	}

	@Operation(summary = "차용증 수정", description = "기존 차용증 정보를 수정합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "차용증 수정 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = FormDetailResponse.class)
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "잘못된 입력값",
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
	@PutMapping("/{formId}")
	public ResponseEntity<FormDetailResponse> updateForm(
		@Parameter(description = "차용증 ID", required = true, example = "1")
		@PathVariable Integer formId,
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "차용증 수정 정보",
			required = true,
			content = @Content(schema = @Schema(implementation = FormUpdateRequest.class))
		)
		@Valid @RequestBody FormUpdateRequest formUpdateRequest) {
		log.info("차용증 수정: id={}", formId);
		Integer currentUserId = 1;
		return ResponseEntity.status(HttpStatus.OK)
			.body(formService.updateForm(currentUserId, formId, formUpdateRequest));
	}

	@Operation(summary = "예상 납부 스케줄 미리보기", description = "대출 정보를 기반으로 예상 납부 스케줄을 계산합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "납부 스케줄 계산 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
					value = """
						{
						  "totalRepaymentAmount": 10500000,
						  "totalInstallments": 12,
						  "schedulePage": {
						    "content": [
						      {
						        "installmentNumber": 1,
						        "paymentDate": "2024-05-25T00:00:00",
						        "principal": 833333,
						        "interest": 41667,
						        "paymentAmount": 875000
						      },
						      {
						        "installmentNumber": 2,
						        "paymentDate": "2024-06-25T00:00:00",
						        "principal": 833333,
						        "interest": 37500,
						        "paymentAmount": 870833
						      }
						    ],
						    "totalElements": 12,
						    "totalPages": 2,
						    "pageable": {
						      "page": 0,
						      "size": 10,
						      "sort": {
						        "sorted": true,
						        "direction": "ASC"
						      }
						    }
						  }
						}
						"""
				)
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
	@PostMapping("/plan")
	public ResponseEntity<PaymentPreviewResponse> calculatePaymentPlan(
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "납부 스케줄 계산 요청 정보",
			required = true,
			content = @Content(schema = @Schema(implementation = PaymentPreviewRequest.class))
		)
		@Valid @RequestBody PaymentPreviewRequest paymentPreviewRequest,
		@Parameter(description = "페이징 정보")
		@PageableDefault(size = 10) Pageable pageable) {

		log.info("예상 납부 스케줄 계산 요청 - 대출금액: {}, 상환방식: {}, 이자율: {}",
			paymentPreviewRequest.getLoanAmount(), paymentPreviewRequest.getRepaymentMethod(),
			paymentPreviewRequest.getInterestRate());

		PaymentPreviewResponse response = paymentPreviewService.calculatePaymentPreview(paymentPreviewRequest,
			pageable);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

}
