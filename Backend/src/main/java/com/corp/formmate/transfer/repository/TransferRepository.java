package com.corp.formmate.transfer.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.user.entity.UserEntity;

@Repository
public interface TransferRepository extends JpaRepository<TransferEntity, Integer> {

	// 특정 사용자의 송금 또는 수신 거래내역 조회
	Page<TransferEntity> findBySenderOrReceiverAndTransactionDateBetween(
		UserEntity sender, UserEntity receiver,
		LocalDateTime startDate, LocalDateTime endDate,
		Pageable pageable);

	// 날짜 범위 내 특정 사용자의 송금 내역
	Page<TransferEntity> findBySenderAndTransactionDateBetween(
		UserEntity sender,
		LocalDateTime startDate, LocalDateTime endDate,
		Pageable pageable);

	// 날짜 범위 내 특정 사용자의 수신 내역
	Page<TransferEntity> findByReceiverAndTransactionDateBetween(
		UserEntity receiver,
		LocalDateTime startDate, LocalDateTime endDate,
		Pageable pageable);

	Optional<List<TransferEntity>> findByForm(FormEntity form);
}
