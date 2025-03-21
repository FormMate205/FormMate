package com.corp.formmate.form.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.corp.formmate.form.dto.FormCreateRequest;
import com.corp.formmate.form.dto.FormDetailResponse;
import com.corp.formmate.form.service.FormService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/form")
@RequiredArgsConstructor
@Slf4j
public class FormController {

	private final FormService formService;

	@GetMapping("/{formId}")
	public ResponseEntity<FormDetailResponse> selectForm(@PathVariable Integer formId) {
		return ResponseEntity.ok(formService.selectFormById(formId));
	}

	@PostMapping("")
	public ResponseEntity<FormDetailResponse> createForm(FormCreateRequest formCreateRequest) {
		Integer currentUserId = 1;
		return ResponseEntity.ok(formService.createForm(currentUserId, formCreateRequest));
	}
}
