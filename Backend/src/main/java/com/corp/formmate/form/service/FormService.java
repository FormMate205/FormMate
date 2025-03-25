package com.corp.formmate.form.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.form.dto.FormCountResponse;
import com.corp.formmate.form.dto.FormCreateRequest;
import com.corp.formmate.form.dto.FormDetailResponse;
import com.corp.formmate.form.dto.FormListResponse;
import com.corp.formmate.form.dto.FormPartnerResponse;
import com.corp.formmate.form.dto.FormUpdateRequest;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.specialterm.dto.SpecialTermResponse;
import com.corp.formmate.specialterm.service.SpecialTermService;
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

	private final SpecialTermService specialTermService;

	// 계약서 생성
	@Transactional
	public FormDetailResponse createForm(Integer userId, FormCreateRequest request) {
		request.validate();
		UserEntity creator = userService.selectById(userId);
		UserEntity receiver = userService.selectById(request.getReceiverId());
		UserEntity creditor = userService.selectById(request.getCreditorId());
		UserEntity debtor = userService.selectById(request.getDebtorId());
		FormEntity formEntity = request.toEntity(request, creator, receiver, creditor, debtor);
		formRepository.save(formEntity);
		List<SpecialTermResponse> specialTermResponses = specialTermService.createSpecialTerms(formEntity,
			request.getSpecialTermIndexes());
		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// id로 FormDetailResponse 조회
	@Transactional(readOnly = true)
	public FormDetailResponse selectFormById(Integer formId) {
		FormEntity formEntity = selectById(formId);
		List<SpecialTermResponse> specialTermResponses = specialTermService.selectSpecialTermsByFormId(formId);
		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// 계약서 수정
	@Transactional
	public FormDetailResponse updateForm(Integer userId, Integer formId, FormUpdateRequest request) {
		request.validate();
		FormEntity formEntity = selectById(formId);
		if (userId == null) {
			throw new UserException(ErrorCode.USER_NOT_FOUND);
		}
		if (userId != formEntity.getCreator().getId()) {
			throw new FormException(ErrorCode.INVALID_CREATOR_ID);
		}
		formEntity.update(request);
		formRepository.save(formEntity);
		List<SpecialTermResponse> specialTermResponses = specialTermService.updateSpecialTerms(formEntity,
			request.getSpecialTermIndexes());
		return FormDetailResponse.fromEntity(formEntity, specialTermResponses);
	}

	// id로 formEntity 조회
	@Transactional(readOnly = true)
	public FormEntity selectById(Integer formId) {
		FormEntity formEntity = formRepository.findById(formId).orElse(null);
		if (formEntity == null) {
			throw new FormException(ErrorCode.FORM_NOT_FOUND);
		}
		return formEntity;
	}

	// 로그인한 유저의 계약서 전체 조회(상태 : 전체, 진행중, 연체, 종료)
	@Transactional(readOnly = true)
	public Page<FormListResponse> selectForms(Integer currentUserId, String status, String name,
		Pageable pageable) {
		UserEntity userEntity = userService.selectById(currentUserId);

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

	// 특정 유저의 계약 상태별 개수 조회(1. 대기중 : 상대승인전, 상대승인후 2. 진행중 3. 완료)
	@Transactional(readOnly = true)
	public FormCountResponse countUsersForm(Integer userId) {
		userService.selectById(userId);

		// 대기중 상태 합계
		Integer formPendingCount =
			formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.BEFORE_APPROVAL) +
				formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.AFTER_APPROVAL);

		// 진행중 상태
		Integer formActiveCount = formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.IN_PROGRESS);

		// 완료 상태
		Integer formCompletedCount = formRepository.countByCreditorIdOrDebtorIdAndStatus(userId, FormStatus.COMPLETED);

		return FormCountResponse.builder()
			.formPendingCount(formPendingCount)
			.formActiveCount(formActiveCount)
			.formCompletedCount(formCompletedCount)
			.build();
	}

	// 최근 계약 상대 조회
	@Transactional(readOnly = true)
	public Page<FormPartnerResponse> selectFormPartner(Integer userId, Pageable pageable) {
		Page<UserEntity> userEntities = formRepository.findDistinctContractedUsersByUserId(userId, pageable);
		return userEntities.map(user -> new FormPartnerResponse(
			user.getId(),
			user.getUserName(),
			user.getPhoneNumber()
		));
	}
}
