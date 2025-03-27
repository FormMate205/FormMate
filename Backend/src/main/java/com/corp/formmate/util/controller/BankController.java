package com.corp.formmate.util.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.util.dto.BankAccountSearchResponse;
import com.corp.formmate.util.dto.BankAuthCodeResponse;
import com.corp.formmate.util.dto.BankVerifyOneWonRequest;
import com.corp.formmate.util.header.BankHeader;
import com.corp.formmate.util.service.BankService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "가상 은행 API", description = "가상 은행 관련 API")

public class BankController {

	@Autowired
	private BankHeader bankHeader;

	private final BankService bankService;

	@GetMapping("/header")
	public BankHeader getBankHeader(
		@Parameter(description = "Api 엔드포인트 작성", example = "member")
		@RequestParam String apiName) {
		return bankHeader.generateHeader(apiName);
	}

	@GetMapping("")
	public ResponseEntity<BankAccountSearchResponse> selectBankAccount(
		@Parameter(description = "계좌번호", example = "0030924135036561")
		@RequestParam String accountNumber) {

		BankAccountSearchResponse response = bankService.selectBankAccount(accountNumber);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@GetMapping("/auth")
	public ResponseEntity<BankAuthCodeResponse> selectSendOneWon(
		@Parameter(description = "계좌번호", example = "0030924135036561")
		@RequestParam String accountNumber) {

		BankAuthCodeResponse response = bankService.selectSendOneWon(accountNumber);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PostMapping("/auth")
	public ResponseEntity<Boolean> selectVerifyOneWon(
		@RequestBody BankVerifyOneWonRequest bankVerifyOneWonRequest) {

		Boolean response = bankService.selectVerifyOneWon(bankVerifyOneWonRequest);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
