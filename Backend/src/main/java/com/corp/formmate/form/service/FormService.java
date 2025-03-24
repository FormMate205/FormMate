package com.corp.formmate.form.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.form.dto.FormCreateRequest;
import com.corp.formmate.form.dto.FormDetailResponse;
import com.corp.formmate.form.dto.FormListResponse;
import com.corp.formmate.form.dto.FormUpdateRequest;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class FormService {

	private final FormRepository formRepository;

	private final UserService userService;

	// 계약서 생성
	@Transactional
	public FormDetailResponse createForm(Integer userId, FormCreateRequest request) {
		request.validate();
		UserEntity creator = userService.findById(userId);
		UserEntity receiver = userService.findById(request.getReceiverId());
		UserEntity creditor = userService.findById(request.getCreditorId());
		UserEntity debtor = userService.findById(request.getDebtorId());
		FormEntity formEntity = request.toEntity(request, creator, receiver, creditor, debtor);
		formRepository.save(formEntity);
		return FormDetailResponse.fromEntity(formEntity);
	}

	// id로 FormDetailResponse 조회
	@Transactional(readOnly = true)
	public FormDetailResponse selectFormById(Integer formId) {
		FormEntity formEntity = findById(formId);
		return FormDetailResponse.fromEntity(formEntity);
	}

	// 계약서 수정
	@Transactional
	public FormDetailResponse updateForm(Integer userId, Integer formId, FormUpdateRequest request) {
		request.validate();
		FormEntity formEntity = findById(formId);
		if (userId == null) {
			throw new UserException(ErrorCode.USER_NOT_FOUND);
		}
		if (userId != formEntity.getCreator().getId()) {
			throw new FormException(ErrorCode.INVALID_CREATOR_ID);
		}
		formEntity.update(request);
		formRepository.save(formEntity);
		return FormDetailResponse.fromEntity(formEntity);
	}

	// id로 formEntity 조회
	@Transactional(readOnly = true)
	public FormEntity findById(Integer formId) {
		FormEntity formEntity = formRepository.findById(formId).orElse(null);
		if (formEntity == null) {
			throw new FormException(ErrorCode.FORM_NOT_FOUND);
		}
		return formEntity;
	}

	// 로그인한 유저의 계약서 전체 조회(상태 : 전체, 진행중, 연체, 종료)
	public Page<FormListResponse> selectForms(Integer currentUserId, String status, String name,
		Pageable pageable) {
		UserEntity userEntity = userService.findById(currentUserId);

		// 상태 필터 처리
		FormStatus formStatus = null;
		if (status != null && !status.equals("전체")) {
			formStatus = FormStatus.fromKorName(status);
		}

		// 이름 필터 처리
		String searchName = (name != null && !name.trim().isEmpty()) ? name : null;

		// 조건에 맞는 폼 조회
		Page<FormEntity> formEntities = formRepository.findAllWithFilters(
			currentUserId, formStatus, searchName, pageable);

		if (formEntities.isEmpty()) {
			throw new FormException(ErrorCode.FORM_NOT_FOUND);
		}

		// Entity를 DTO로 변환해서 반환 (currentUserId 전달)
		return formEntities.map(entity -> FormListResponse.fromEntity(entity, currentUserId));
	}
}
