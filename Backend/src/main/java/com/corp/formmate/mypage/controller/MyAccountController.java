package com.corp.formmate.mypage.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.mypage.dto.AccountRegisterRequest;
import com.corp.formmate.mypage.dto.AccountSearchRequest;
import com.corp.formmate.mypage.dto.CheckAccountPasswordRequest;
import com.corp.formmate.mypage.dto.SearchMyAccountResponse;
import com.corp.formmate.mypage.service.MyAccountService;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/users/account")
@RequiredArgsConstructor
@Tag(name = "나의 계좌 API", description = "나의 계좌 관련 API")
public class MyAccountController {
	private final MyAccountService myAccountService;

	@Operation(summary = "나의 계좌 조회", description = "로그인한 사용자의 계좌 정보를 조회합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계좌 조회 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = SearchMyAccountResponse.class),
				examples = @ExampleObject(
					value = """
						{
						    "bankName": "한국은행",
						    "accountNumber": "1112222233333",
						    "balance": 100000
						}
						"""
				)
			)
		),
		@ApiResponse(
			responseCode = "404",
			description = "계좌 정보를 찾을 수 없습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class),
				examples = @ExampleObject(
					value = """
						{
						    "timestamp": "2024-01-23T10:00:00",
						    "status": 404,
						    "message": "계좌 정보를 찾을 수 없습니다",
						    "errors": []
						}
						"""
				)
			)
		),
		@ApiResponse(
			responseCode = "500",
			description = "서버 오류가 발생했습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@GetMapping("")
	public ResponseEntity<?> selectMyAccount(@CurrentUser AuthUser authUser) {
		log.info("사용자 계좌 조회: userId={}", authUser.getId());
		SearchMyAccountResponse response = myAccountService.selectMyAccount(authUser.getId());
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	// 계좌 정보 입력
	@Operation(summary = "계좌 정보 확인 및 1원 송금 인증", description = "입력한 계좌 정보를 확인하고 1원 송금 인증을 시작합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계좌 확인 및 인증 메시지 발송 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(type = "string"),
				examples = @ExampleObject(value = "\"1원이 송금되었습니다. 인증번호를 확인해주세요.\"")
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "유효하지 않은 계좌번호 또는 중복 등록",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class),
				examples = {
					@ExampleObject(
						name = "유효하지 않은 계좌번호",
						value = """
							{
							    "timestamp": "2024-01-23T10:00:00",
							    "status": 400,
							    "message": "유효하지 않은 계좌번호입니다",
							    "errors": []
							}
							"""
					),
					@ExampleObject(
						name = "유효하지 않은 은행 코드",
						value = """
							{
							    "timestamp": "2024-01-23T10:00:00",
							    "status": 400,
							    "message": "유효하지 않은 은행 코드입니다",
							    "errors": []
							}
							"""
					),
					@ExampleObject(
						name = "이미 등록된 계좌",
						value = """
							{
							    "timestamp": "2024-01-23T10:00:00",
							    "status": 400,
							    "message": "이미 등록된 계좌입니다",
							    "errors": []
							}
							"""
					)
				}
			)
		),
		@ApiResponse(
			responseCode = "500",
			description = "은행 시스템 연결 중 오류가 발생했습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@PostMapping("")
	public ResponseEntity<?> searchAndVerifyMyAccount(
		@CurrentUser AuthUser authUser,
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "계좌 정보 확인 요청",
			required = true,
			content = @Content(schema = @Schema(implementation = AccountSearchRequest.class))
		)
		@Valid @RequestBody AccountSearchRequest request) {
		log.info("계좌 정보 확인 및 1원 송금 인증: userId={}, bankName={}", authUser.getId(), request.getBankName());
		myAccountService.searchAndVerifyMyAccount(authUser.getId(), request);
		return ResponseEntity.status(HttpStatus.OK).body("1원이 송금되었습니다. 인증번호를 확인해주세요.");
	}

	@Operation(summary = "계좌 등록", description = "인증코드를 확인하고 계좌를 등록합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계좌 등록 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(type = "string"),
				examples = @ExampleObject(value = "\"계좌가 등록되었습니다.\"")
			)
		),
		@ApiResponse(
			responseCode = "400",
			description = "유효하지 않은 인증코드입니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class),
				examples = @ExampleObject(
					value = """
						{
						    "timestamp": "2024-01-23T10:00:00",
						    "status": 400,
						    "message": "유효하지 않은 인증코드입니다",
						    "errors": []
						}
						"""
				)
			)
		),
		@ApiResponse(
			responseCode = "429",
			description = "인증 시도 횟수를 초과했습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class),
				examples = @ExampleObject(
					value = """
						{
						    "timestamp": "2024-01-23T10:00:00",
						    "status": 429,
						    "message": "인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요",
						    "errors": []
						}
						"""
				)
			)
		)
	})
	@PutMapping("/register")
	public ResponseEntity<?> registMyAccount(
		@CurrentUser AuthUser authUser,
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "계좌 등록 요청",
			required = true,
			content = @Content(schema = @Schema(implementation = AccountRegisterRequest.class))
		)
		@Valid @RequestBody AccountRegisterRequest request) {
		log.info("계좌 등록: userId={}, bankName={}", authUser.getId(), request.getBankName());
		myAccountService.registMyAccount(authUser.getId(), request);
		return ResponseEntity.status(HttpStatus.OK).body("계좌가 등록되었습니다.");
	}

	@Operation(summary = "계좌 삭제", description = "사용자의 계좌 정보를 삭제합니다.")
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "계좌 삭제 성공",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(type = "string"),
				examples = @ExampleObject(value = "\"계좌가 삭제되었습니다.\"")
			)
		),
		@ApiResponse(
			responseCode = "404",
			description = "계좌 정보를 찾을 수 없습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		),
		@ApiResponse(
			responseCode = "500",
			description = "서버 오류가 발생했습니다",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = ErrorResponse.class)
			)
		)
	})
	@DeleteMapping("")
	public ResponseEntity<?> deleteMyAccount(@CurrentUser AuthUser authUser) {
		log.info("계좌 삭제: userId={}", authUser.getId());
		myAccountService.deleteMyAccount(authUser.getId());
		return ResponseEntity.status(HttpStatus.OK).body("계좌가 삭제되었습니다.");
	}

	@PostMapping("/check-password")
	public ResponseEntity<Boolean> checkAccountPassword(@CurrentUser AuthUser authUser,
		@RequestBody CheckAccountPasswordRequest request) {
		Integer userId = authUser.getId();
		Boolean response = myAccountService.checkAccountPassword(userId, request);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
