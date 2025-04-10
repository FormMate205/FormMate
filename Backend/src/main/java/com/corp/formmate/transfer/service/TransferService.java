package com.corp.formmate.transfer.service;

import static org.springframework.transaction.event.TransactionPhase.*;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

import com.corp.formmate.alert.service.AlertService;
import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.contract.service.ContractService;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.TransferException;
import com.corp.formmate.paymentschedule.entity.PaymentScheduleEntity;
import com.corp.formmate.paymentschedule.service.PaymentScheduleService;
import com.corp.formmate.transfer.dto.TransferCreateRequest;
import com.corp.formmate.transfer.dto.TransferCreateResponse;
import com.corp.formmate.transfer.dto.TransferListResponse;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.util.dto.BankTransferRequest;
import com.corp.formmate.util.service.BankService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class TransferService {

	private final TransferRepository transferRepository;

	private final FormRepository formRepository;

	private final UserService userService;

	private final ContractService contractService;

	private final BankService bankService;

	private final AlertService alertService;

	private final PaymentScheduleService paymentScheduleService;

	@Transactional(readOnly = true)
	public Page<TransferListResponse> selectTransfers(Integer userId, String period, String transferType,
		String sortDirection, Pageable pageable) {

		UserEntity user = userService.selectById(userId);

		Sort sort;
		if (sortDirection.equals("과거순")) {
			sort = Sort.by("transactionDate").ascending();
		} else {
			sort = Sort.by("transactionDate").descending();
		}

		Pageable pageableWithSort = PageRequest.of(
			pageable.getPageNumber(),
			pageable.getPageSize(),
			sort
		);

		LocalDateTime startDate = null;
		LocalDateTime endDate = LocalDateTime.now();

		if (period.equals("1개월")) {
			// 1개월
			startDate = endDate.minusMonths(1);
		} else if (period.equals("3개월")) {
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

		if ("전체".equals(transferType)) {
			// 모든 거래내역 (송금 + 수신)
			transfers = transferRepository.findBySenderOrReceiverAndTransactionDateBetween(
				user, user, startDate, endDate, pageableWithSort);
		} else if ("출금만".equals(transferType)) {
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

	@Transactional
	public TransferCreateResponse createTransfer(Integer userId, @Valid TransferCreateRequest transferCreateRequest) {

		UserEntity sender = userService.selectById(userId);
		UserEntity receiver = userService.selectById(transferCreateRequest.getPartnerId());
		FormEntity formEntity = getFormEntity(transferCreateRequest.getFormId());
		ContractEntity contractEntity = contractService.selectTransferByForm(formEntity);
		Integer currentRound = contractEntity.getCurrentPaymentRound();

		Long repaymentAmount = transferCreateRequest.getRepaymentAmount();
		if (repaymentAmount == null) {
			throw new TransferException(ErrorCode.INVALID_INPUT_VALUE);
		}

		Long amount = transferCreateRequest.getAmount();
		if (amount == null) {
			throw new TransferException(ErrorCode.INVALID_PAYMENT_AMOUNT);
		}

		Long paymentDifference = amount - repaymentAmount;

		TransferEntity transferEntity;

		contractService.updateContract(transferCreateRequest); // contract(계약관리) 관련 처리 로직

		PaymentScheduleEntity paymentSchedule = paymentScheduleService.selectNonPaidByContract(contractEntity);

		int paymentRoundGap = paymentSchedule.getPaymentRound() - currentRound;

		if (paymentRoundGap > 0) { // 중도 상환
			transferEntity = makeTransferEntity(formEntity, sender, receiver, amount, currentRound, paymentDifference,
				TransferStatus.EARLY_REPAYMENT);
		} else if (paymentRoundGap == 0) { // 납부
			if (paymentDifference > 0) {
				transferEntity = makeTransferEntity(formEntity, sender, receiver, amount, currentRound,
					paymentDifference,
					TransferStatus.EARLY_REPAYMENT);
			} else {
				transferEntity = makeTransferEntity(formEntity, sender, receiver, amount, currentRound,
					paymentDifference,
					TransferStatus.PAID);
			}
		} else { // 연체
			transferEntity = makeTransferEntity(formEntity, sender, receiver, amount, currentRound, paymentDifference,
				TransferStatus.OVERDUE);
		}

		transferRepository.save(transferEntity);

		String senderName = transferEntity.getSender().getUserName();
		String senderAccountLast4 = getLast4Digits(transferEntity.getSender().getAccountNumber());
		String receiverName = transferEntity.getReceiver().getUserName();
		String receiverAccountLast4 = getLast4Digits(transferEntity.getReceiver().getAccountNumber());

		NumberFormat formatter = NumberFormat.getNumberInstance();
		String formattedAmount = formatter.format(amount);

		// 입금자 알림
		String depositTitle = receiverName + "(" + receiverAccountLast4 + ") 입금 알림";
		String depositContent = "입금 " + formattedAmount + "원 | " + senderName;
		alertService.createAlert(transferEntity.getReceiver(), "입금", depositTitle, depositContent);

		// 출금자 알림
		String withdrawTitle = senderName + "(" + senderAccountLast4 + ") 출금 알림";
		String withdrawContent = "출금 " + formattedAmount + "원 | " + receiverName;
		alertService.createAlert(transferEntity.getSender(), "출금", withdrawTitle, withdrawContent);

		// 외부 은행 API 이체 로직 실행
		onTransferEvent(BankTransferRequest.builder()
			.depositAccountNo(receiver.getAccountNumber())
			.withdrawalAccountNo(sender.getAccountNumber())
			.transactionBalance(amount)
			.build());

		return TransferCreateResponse.fromEntity(transferEntity);
	}

	// 최초 거래 생성(계약 성사 되었을때 채권자가 채무자에게 돈 송금)
	@Transactional
	public void createInitialTransfer(FormEntity formEntity) {
		String depositAccountNo = formEntity.getDebtor().getAccountNumber();  // 입금 계좌
		Long transactionBalance = formEntity.getLoanAmount(); // 대출금액
		String withdrawalAccountNo = formEntity.getCreditor().getAccountNumber(); // 출금 계좌

		BankTransferRequest bankTransferRequest = BankTransferRequest.builder()
			.depositAccountNo(depositAccountNo)
			.withdrawalAccountNo(withdrawalAccountNo)
			.transactionBalance(transactionBalance)
			.build();

		TransferEntity transferEntity = TransferEntity.builder()
			.form(formEntity)
			.sender(formEntity.getCreditor())
			.receiver(formEntity.getDebtor())
			.amount(transactionBalance)
			.currentRound(0)
			.paymentDifference(0L)
			.status(TransferStatus.PAID)
			.transactionDate(LocalDateTime.now())
			.build();

		transferRepository.save(transferEntity);

		String senderName = transferEntity.getSender().getUserName();
		String senderAccountLast4 = getLast4Digits(transferEntity.getSender().getAccountNumber());
		String receiverName = transferEntity.getReceiver().getUserName();
		String receiverAccountLast4 = getLast4Digits(transferEntity.getReceiver().getAccountNumber());

		NumberFormat formatter = NumberFormat.getNumberInstance();
		String formattedBalance = formatter.format(transactionBalance);

		// 입금자 알림
		String depositTitle = receiverName + "(" + receiverAccountLast4 + ") 입금 알림";
		String depositContent = "입금 " + formattedBalance + "원 | " + senderName;
		alertService.createAlert(transferEntity.getReceiver(), "입금", depositTitle, depositContent);

		// 출금자 알림
		String withdrawTitle = senderName + "(" + senderAccountLast4 + ") 출금 알림";
		String withdrawContent = "출금 " + formattedBalance + "원 | " + receiverName;
		alertService.createAlert(transferEntity.getSender(), "출금", withdrawTitle, withdrawContent);

		onTransferEvent(bankTransferRequest);
	}

	@Transactional(readOnly = true)
	protected FormEntity getFormEntity(Integer formId) {
		FormEntity formEntity = formRepository.findById(formId).orElse(null);
		if (formEntity == null) {
			throw new TransferException(ErrorCode.FORM_NOT_FOUND);
		}
		return formEntity;
	}

	private TransferEntity makeTransferEntity(FormEntity form, UserEntity sender, UserEntity receiver, Long amount,
		Integer currentRound, Long paymentDifference, TransferStatus status) {
		return TransferEntity.builder()
			.form(form)
			.sender(sender)
			.receiver(receiver)
			.amount(amount)
			.currentRound(currentRound)
			.paymentDifference(paymentDifference)
			.status(status)
			.transactionDate(LocalDateTime.now())
			.build();
	}

	private String getLast4Digits(String accountNumber) {
		if (accountNumber == null || accountNumber.length() < 4)
			return "****";
		return accountNumber.substring(accountNumber.length() - 4);
	}

	@TransactionalEventListener(phase = AFTER_COMMIT)
	public void onTransferEvent(BankTransferRequest bankTransferRequest) {
		// 커밋된 이후에 외부 API 호출
		bankService.createBankTransfer(bankTransferRequest);
	}
}

