package com.corp.formmate.specialterm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.specialterm.dto.SpecialTermResponse;
import com.corp.formmate.specialterm.service.SpecialTermService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/special-term")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "특약 API", description = "특약 관련 API")
public class SpecialTermController {

	private final SpecialTermService specialTermService;

	@Operation(
		summary = "모든 특약 목록 조회",
		description = "시스템에 정의된 모든 특약 항목을 조회합니다."
	)
	@ApiResponses({
		@ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(
				array = @ArraySchema(
					schema = @Schema(implementation = SpecialTermResponse.class)
				)
			)
		)
	})
	@GetMapping("")
	public ResponseEntity<List<SpecialTermResponse>> selectAllSpecialTerms() {
		log.info("모든 특약 목록 조회");
		return ResponseEntity.status(HttpStatus.OK).body(specialTermService.selectAllSpecialTerms());
	}

}
