package com.corp.formmate.alert.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.alert.dto.AlertCountResponse;
import com.corp.formmate.alert.dto.AlertListResponse;
import com.corp.formmate.alert.service.AlertService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/alert")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "알림 API", description = "알림 관련 API")
public class AlertController {

	private final AlertService alertService;

	@Operation(summary = "읽지 않은 알림 목록 조회", description = "로그인한 사용자의 읽지 않은 알림 목록을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "읽지 않은 알림 목록 조회 성공", content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					[
					  {
					    \"alertId\": 1,
					    \"alertType\": \"연체\",
					    \"title\": \"연체가 발생했습니다!\",
					    \"content\": \"계약이 제대로 이행되지 않았습니다.\",
					    \"isRead\": false,
					    \"createdAt\": \"2025-03-21T00:00:00\"
					  }
					]
					"""
			)
		))
	})
	@GetMapping("/unread")
	public ResponseEntity<List<AlertListResponse>> selectUnreadAlerts(
		@CurrentUser AuthUser authUser) {

		Integer userId = authUser.getId();

		List<AlertListResponse> responses = alertService.selectUnreadAlerts(userId);
		return ResponseEntity.status(HttpStatus.OK).body(responses);
	}

	@Operation(summary = "알림 이력 조회", description = "알림 ID를 기준으로 알림 이력을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "알림 이력 조회 성공", content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					{
					  \"content\": [
					    {
					      \"alertId\": 1,
					      \"alertType\": \"연체\",
					      \"title\": \"연체가 발생했습니다!\",
					      \"content\": \"계약이 제대로 이행되지 않았습니다.\",
					      \"isRead\": false,
					      \"createdAt\": \"2025-03-21T00:00:00\"
					    }
					  ],
					  \"totalElements\": 10,
					  \"totalPages\": 1,
					  \"pageable\": {
					    \"page\": 0,
					    \"size\": 10,
					    \"sort\": {
					      \"sorted\": true,
					      \"direction\": \"DESC\"
					    }
					  }
					}
					"""
			)
		))
	})
	@GetMapping("/history/{alertId}")
	public ResponseEntity<Page<AlertListResponse>> selectUnreadAlerts(
		@CurrentUser AuthUser authUser,

		@Parameter(description = "알림 ID", required = true, example = "1")
		@PathVariable Integer alertId,

		@Parameter(description = "페이징 정보")
		Pageable pageable
	) {

		Integer userId = authUser.getId();

		Page<AlertListResponse> responses = alertService.selectAlerts(userId, alertId, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(responses);
	}

	@Operation(summary = "읽지 않은 알림 전체 읽음 처리", description = "사용자의 모든 읽지 않은 알림을 읽음으로 처리합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "알림 수정 성공", content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(value = "true")
		))
	})
	@PatchMapping("")
	public ResponseEntity<Boolean> updateUnreadAlerts(@CurrentUser AuthUser authUser) {
		Integer userId = authUser.getId();
		boolean response = alertService.updateUnreadAlerts(userId);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Operation(summary = "알림 삭제", description = "알림을 삭제합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "알림 삭제 성공", content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(value = "true")
		))
	})
	@DeleteMapping("/{alertId}")
	public ResponseEntity<Boolean> deleteAlert(
		@CurrentUser AuthUser authUser,

		@Parameter(description = "알림 ID", required = true, example = "1")
		@PathVariable Integer alertId
	) {

		Integer userId = authUser.getId();
		boolean response = alertService.deleteAlert(userId, alertId);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@Operation(summary = "읽지 않은 알림 개수 조회", description = "사용자의 읽지 않은 알림 개수를 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "읽지 않은 알림 개수 조회 성공", content = @Content(
			mediaType = "application/json",
			examples = @ExampleObject(
				value = """
					{
					  \"unreadAlertCount\": 3
					}
					"""
			)
		))
	})
	@GetMapping("/count-unread")
	public ResponseEntity<AlertCountResponse> countUnreadAlerts(@CurrentUser AuthUser authUser) {
		Integer userId = authUser.getId();
		AlertCountResponse response = alertService.countUnreadAlerts(userId);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
}
