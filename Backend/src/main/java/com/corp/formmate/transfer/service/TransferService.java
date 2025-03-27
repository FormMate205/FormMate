package com.corp.formmate.transfer.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.TransferException;
import com.corp.formmate.transfer.dto.TransferListResponse;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.repository.TransferRepository;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class TransferService {

	private final TransferRepository transferRepository;

	private final UserService userService;

	public Page<TransferListResponse> selectTransfers(Integer userId, String period, String transferType,
		Boolean latestFirst, Pageable pageable) {

		UserEntity user = userService.selectById(userId);

		Sort sort = latestFirst
			? Sort.by("transactionDate").descending()
			: Sort.by("transactionDate").ascending();

		Pageable pageableWithSort = PageRequest.of(
			pageable.getPageNumber(),
			pageable.getPageSize(),
			sort
		);

		LocalDateTime startDate = null;
		LocalDateTime endDate = LocalDateTime.now();

		if (period.equals("1m")) {
			// 1개월
			startDate = endDate.minusMonths(1);
		} else if (period.equals("3m")) {
			// 3개월
			startDate = endDate.minusMonths(3);
		} else if (period.contains("~")) {
			// 직접 입력 (yyyyMMdd~yyyyMMdd 형식)
			String[] dates = period.split("~");
			if (dates.length != 2) {
				throw new TransferException(ErrorCode.INVALID_DATE_RANGE);
			}

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
			try {
				startDate = LocalDate.parse(dates[0], formatter).atStartOfDay();
				endDate = LocalDate.parse(dates[1], formatter).atTime(23, 59, 59);
			} catch (Exception e) {
				throw new TransferException(ErrorCode.INVALID_DATE_RANGE);
			}

			if (startDate.isAfter(endDate)) {
				throw new TransferException(ErrorCode.START_DATE_AFTER_END_DATE);
			}
		}

		Page<TransferEntity> transfers;

		if ("ALL".equals(transferType)) {
			// 모든 거래내역 (송금 + 수신)
			transfers = transferRepository.findBySenderOrReceiverAndTransactionDateBetween(
				user, user, startDate, endDate, pageableWithSort);
		} else if ("SEND".equals(transferType)) {
			// 송금한 내역 (출금)
			transfers = transferRepository.findBySenderAndTransactionDateBetween(
				user, startDate, endDate, pageableWithSort);
		} else {
			// 수신한 내역 (입금)
			transfers = transferRepository.findByReceiverAndTransactionDateBetween(
				user, startDate, endDate, pageableWithSort);
		}
		return transfers.map(transfer -> TransferListResponse.fromEntity(transfer, user));
	}
}

