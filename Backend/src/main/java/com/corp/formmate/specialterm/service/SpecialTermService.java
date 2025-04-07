package com.corp.formmate.specialterm.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
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
	public List<SpecialTermResponse> updateSpecialTerms(FormEntity formEntity, List<Integer> specialTermIndexes) {
		// 기존 특약 목록 조회
		List<SpecialTermEntity> existingTerms = specialTermRepository.findByFormIdOrderBySpecialTermIndexAsc(
			formEntity.getId());

		// 기존 특약의 인덱스 추출
		Set<Integer> existingIndexes = existingTerms.stream()
			.map(SpecialTermEntity::getSpecialTermIndex)
			.collect(Collectors.toSet());

		// 새로 요청된 인덱스 목록을 Set으로 변환
		Set<Integer> newIndexes = new HashSet<>(
			specialTermIndexes != null ? specialTermIndexes : Collections.emptyList());

		// 추가할 인덱스 (새 인덱스 - 기존 인덱스)
		Set<Integer> indexesToAdd = new HashSet<>(newIndexes);
		indexesToAdd.removeAll(existingIndexes);

		// 삭제할 인덱스 (기존 인덱스 - 새 인덱스)
		Set<Integer> indexesToRemove = new HashSet<>(existingIndexes);
		indexesToRemove.removeAll(newIndexes);

		// 삭제할 항목 처리
		if (!indexesToRemove.isEmpty()) {
			existingTerms.removeIf(term -> indexesToRemove.contains(term.getSpecialTermIndex()));
			specialTermRepository.deleteByFormIdAndSpecialTermIndexIn(formEntity.getId(), indexesToRemove);
		}

		// 추가할 항목 처리
		List<SpecialTermEntity> newEntities = indexesToAdd.stream()
			.map(index -> {
				for (SpecialTerm term : SpecialTerm.values()) {
					if (term.getSpecialTermIndex() == index) {
						return SpecialTermEntity.builder()
							.form(formEntity)
							.specialTermIndex(index)
							.specialTermDetail(term.getSpecialTermDetail())
							.build();
					}
				}
				return null;
			})
			.filter(Objects::nonNull)
			.collect(Collectors.toList());

		if (!newEntities.isEmpty()) {
			specialTermRepository.saveAll(newEntities);
			existingTerms.addAll(newEntities);
		}

		// 응답 생성 (최종 결과가 정렬되도록)
		return existingTerms.stream()
			.sorted(Comparator.comparing(SpecialTermEntity::getSpecialTermIndex))
			.map(entity -> new SpecialTermResponse(
				entity.getSpecialTermIndex(),
				entity.getSpecialTermDetail()
			))
			.collect(Collectors.toList());
	}
}
