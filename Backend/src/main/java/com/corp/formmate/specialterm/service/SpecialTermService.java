package com.corp.formmate.specialterm.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.specialterm.dto.SpecialTerm;
import com.corp.formmate.specialterm.dto.SpecialTermResponse;
import com.corp.formmate.specialterm.entity.SpecialTermEntity;
import com.corp.formmate.specialterm.repository.SpecialTermRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class SpecialTermService {

	private final SpecialTermRepository specialTermRepository;

	@Transactional(readOnly = true)
	public List<SpecialTermResponse> selectAllSpecialTerms() {
		return Arrays.stream(SpecialTerm.values())
			.map(term -> new SpecialTermResponse(
				term.getSpecialTermIndex(),
				term.getSpecialTermDetail()
			))
			.sorted(Comparator.comparing(SpecialTermResponse::getSpecialTermIndex))
			.collect(Collectors.toList());
	}

	// 특정 계약의 특약 조회
	@Transactional(readOnly = true)
	public List<SpecialTermResponse> selectSpecialTermsByFormId(Integer formId) {
		List<SpecialTermEntity> specialTerms = specialTermRepository.findByFormIdOrderBySpecialTermIndexAsc(formId);
		return specialTerms.stream()
			.map(entity -> new SpecialTermResponse(
				entity.getSpecialTermIndex(),
				entity.getSpecialTermDetail()
			))
			.collect(Collectors.toList());
	}

	// 특약 저장
	@Transactional
	public List<SpecialTermResponse> createSpecialTerms(FormEntity formEntity, List<Integer> specialTermIndexes) {
		// 특약 인덱스로 SpecialTerm 리스트 가져오기
		List<SpecialTerm> specialTerms = SpecialTerm.getByIndexes(specialTermIndexes);

		// 엔티티 생성 및 저장
		List<SpecialTermEntity> entities = specialTerms.stream()
			.map(term -> SpecialTermEntity.builder()
				.form(formEntity)
				.specialTermIndex(term.getSpecialTermIndex())
				.specialTermDetail(term.getSpecialTermDetail())
				.build())
			.collect(Collectors.toList());

		specialTermRepository.saveAll(entities);

		// 응답 객체 생성
		return specialTerms.stream()
			.map(term -> new SpecialTermResponse(
				term.getSpecialTermIndex(),
				term.getSpecialTermDetail()
			))
			.collect(Collectors.toList());
	}

	// 특약 수정
	@Transactional
	public List<SpecialTermResponse> updateSpecialTerms(FormEntity formEntity, List<SpecialTermResponse> specialTerms) {
		Integer formId = formEntity.getId();

		Set<Integer> newIndexes = specialTerms.stream()
				.map(SpecialTermResponse::getSpecialTermIndex)
				.collect(Collectors.toSet());

		List<SpecialTermEntity> existingTerms = specialTermRepository.findByFormIdOrderBySpecialTermIndexAsc(formId);
		Set<Integer> existingIndexes = existingTerms.stream()
				.map(SpecialTermEntity::getSpecialTermIndex)
				.collect(Collectors.toSet());

		Set<Integer> toDelete = new HashSet<>(existingIndexes);
		toDelete.removeAll(newIndexes);

		Set<Integer> toAdd = new HashSet<>(newIndexes);
		toAdd.removeAll(existingIndexes);

		if (!toDelete.isEmpty()) {
			specialTermRepository.deleteByFormIdAndSpecialTermIndexIn(formId, toDelete);
		}

		List<SpecialTermEntity> newEntities = SpecialTerm.getByIndexes(new ArrayList<>(toAdd)).stream()
				.map(term -> SpecialTermEntity.builder()
						.form(formEntity)
						.specialTermIndex(term.getSpecialTermIndex())
						.specialTermDetail(term.getSpecialTermDetail())
						.build())
				.collect(Collectors.toList());

		if (!newEntities.isEmpty()) {
			specialTermRepository.saveAll(newEntities);
		}

		return specialTermRepository.findByFormIdOrderBySpecialTermIndexAsc(formId).stream()
				.map(e -> new SpecialTermResponse(e.getSpecialTermIndex(), e.getSpecialTermDetail()))
				.collect(Collectors.toList());
	}


}
