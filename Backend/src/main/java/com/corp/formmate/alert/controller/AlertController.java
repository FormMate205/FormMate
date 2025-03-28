package com.corp.formmate.alert.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.alert.dto.AlertUnreadResponse;
import com.corp.formmate.alert.service.AlertService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;

import io.swagger.v3.oas.annotations.Parameter;
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

	@GetMapping("/unread")
	public ResponseEntity<Page<AlertUnreadResponse>> selectUnreadAlerts(
		@CurrentUser AuthUser authUser,

		@Parameter(description = "페이징 정보")
		@PageableDefault Pageable pageable) {

		Integer userId = authUser.getId();

		Page<AlertUnreadResponse> responses = alertService.selectUnreadAlerts(userId, pageable);
		return ResponseEntity.status(HttpStatus.OK).body(responses);
	}
}
