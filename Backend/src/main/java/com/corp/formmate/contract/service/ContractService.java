package com.corp.formmate.contract.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.dto.MonthlyContractDetail;
import com.corp.formmate.contract.dto.MonthlyContractResponse;
import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.contract.repository.ContractRepository;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.dto.PaymentScheduleResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.form.service.PaymentPreviewService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.global.error.exception.TransferException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {

	private final ContractRepository contractRepository;
	private final FormRepository formRepository;
	private final TransferRepository transferRepository;
	private final PaymentPreviewService paymentPreviewService;
	private final UserRepository userRepository;

	/**
	 * 계약 상세 정보를 조회하는 메서드
	 * - 사용자 역할(채권자/채무자) 판단
	 * - 계약 상태에 따라 연체, 상환액, 중도상환 수수료 등을 종합적으로 계산하여 반환
	 */
	@Transactional
	public ContractDetailResponse selectContractDetail(AuthUser user, Integer formId) {
		FormEntity form = getForm(formId); // 계약서 정보 조회
		ContractEntity contract = getContract(form); // 계약 상태 정보 조회
		UserEntity userEntity = getUser(user.getId()); // 로그인한 사용자 정보 조회
		List<TransferEntity> transfers = getTransfers(form); // 해당 계약의 송금 내역 조회

		// 로그인한 사용자가 채권자인지 확인
		boolean userIsCreditor = form.getCreditorName().equals(userEntity.getUserName());
		String contracteeName = userIsCreditor ? form.getDebtorName() : form.getCreditorName();

		// 현재까지 납부한 총액 계산 (모든 회차의 송금 금액 합)
		long repaymentAmount = transfers.stream()
			.mapToLong(TransferEntity::getAmount)
			.sum();

		// 중도상환 상태인 송금 건 중, 수수료 대상(paymentDifference > 0)만 추출해 수수료 총합 계산
		long totalEarlyRepaymentCharge = transfers.stream()
			.filter(t -> t.getStatus() == TransferStatus.EARLY_REPAYMENT && t.getPaymentDifference() > 0)
			.mapToLong(t -> calculateEarlyRepaymentFee(t.getPaymentDifference(), form))
			.sum();

		// ContractDetailResponse DTO로 결과 구성
		return ContractDetailResponse.builder()
			.userIsCreditor(userIsCreditor)
			.contracteeName(contracteeName)
			.overdueCount(contract.getOverdueCount())
			.overdueLimit(form.getOverdueLimit())
			.overdueAmount(contract.getOverdueAmount())
			.nextRepaymentDate(contract.getNextRepaymentDate())
			.earlyRepaymentCount(contract.getEarlyRepaymentCount())
			.totalEarlyRepaymentCharge(totalEarlyRepaymentCharge)
			.repaymentAmount(repaymentAmount)
			.remainingPrincipal(contract.getRemainingPrincipal())
			.build();
	}

	/**
	 * 이번 회차의 예상 납부 금액을 계산하는 메서드
	 * - 중도상환이 이미 완료된 경우 납부할 금액은 0
	 * - 이번 회차의 송금 내역을 기준으로 paymentDifference(차이) 계산
	 */
	@Transactional
	public ExpectedPaymentAmountResponse selectExpectedPaymentAmount(Integer formId) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);

		// 이미 중도상환된 경우 추가 납부 없음
		if (contract.getTotalEarlyRepaymentFee() > 0) {
			return ExpectedPaymentAmountResponse.builder()
				.monthlyRemainingPayment(0L)
				.earlyRepaymentFeeRate(form.getEarlyRepaymentFeeRate())
				.build();
		}

		// 회차 기준 송금 내역 중 paymentDifference가 존재하는 경우만 납부금으로 간주
		List<TransferEntity> transfers = transferRepository.findByFormOrderByTransactionDateDesc(form);
		int currentRound = contract.getCurrentPaymentRound();

		long monthlyRemaining = transfers.stream()
			.filter(t -> t.getCurrentRound() == currentRound)
			.findFirst()
			.map(t -> Math.max(0, t.getPaymentDifference())) // 음수 방지
			.orElse(0L);

		return ExpectedPaymentAmountResponse.builder()
			.monthlyRemainingPayment(monthlyRemaining)
			.earlyRepaymentFeeRate(form.getEarlyRepaymentFeeRate())
			.build();
	}

	/**
	 * 계약에 대한 누적 이자 정보 및 예상 만기 납부금액 정보를 조회하는 메서드
	 * - 납부한 원금/이자/연체이자 및 중도상환 수수료 포함
	 * - 이번 회차의 미납 금액 및 만기 시 납부 예상 금액까지 포함
	 */
	@Transactional
	public InterestResponse selectInterestResponse(Integer formId) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);

		int currentRound = contract.getCurrentPaymentRound();
		long paidPrincipal = form.getLoanAmount() - contract.getRemainingPrincipal();
		long unpaidAmount = getUnpaidAmount(form, contract, currentRound);

		long maturityPayment = contract.getExpectedMaturityPayment();
		long maturityInterest = contract.getExpectedInterestAmountAtMaturity();
		long maturityPrincipal = maturityPayment - maturityInterest;

		return InterestResponse.builder()
			.paidPrincipalAmount(paidPrincipal)
			.paidInterestAmount(contract.getInterestAmount())
			.paidOverdueInterestAmount(contract.getOverdueInterestAmount())
			.totalEarlyRepaymentFee(contract.getTotalEarlyRepaymentFee())
			.unpaidAmount(unpaidAmount)
			.expectedPaymentAmountAtMaturity(maturityPayment)
			.expectedPrincipalAmountAtMaturity(maturityPrincipal)
			.expectedInterestAmountAtMaturity(maturityInterest)
			.build();
	}

	/**
	 * 이번 회차 미납 금액을 계산하는 메서드
	 * - PaymentPreviewService의 스케줄을 기준으로 이 회차 납부해야 할 금액 추출
	 * - 이미 송금된 금액이 있다면 차감하고, 연체액이 있으면 더함
	 * - 최종적으로 음수가 되지 않도록 0 이하일 경우 0으로 반환
	 */
	private long getUnpaidAmount(FormEntity form, ContractEntity contract, int round) {
		PaymentPreviewResponse preview = paymentPreviewService.calculatePaymentPreview(
			new PaymentPreviewRequest(form), PageRequest.of(0, 1000));

		long unpaid = preview.getSchedulePage().stream()
			.filter(p -> p.getInstallmentNumber().equals(round))
			.findFirst()
			.map(PaymentScheduleResponse::getPaymentAmount)
			.orElse(0L);

		// 연체가 없을 경우 실제 납부한 금액을 차감함
		if (contract.getOverdueAmount() == 0) {
			long paidThisRound = transferRepository.findByForm(form)
				.orElse(Collections.emptyList())
				.stream()
				.filter(t -> t.getCurrentRound() == round)
				.mapToLong(TransferEntity::getAmount)
				.sum();
			unpaid -= paidThisRound;
		} else {
			unpaid += contract.getOverdueAmount();
		}

		return Math.max(0, unpaid); // 음수 방지
	}

	/**
	 * 특정 사용자와 상대방 간의 계약을 반환한다 (채권자/채무자 구분 포함)
	 */
	@Transactional
	public List<ContractWithPartnerResponse> selectContractWithPartner(Integer userId, Integer partnerId) {
		LocalDateTime now = LocalDateTime.now();
		List<FormEntity> creditorForms = formRepository.findUserIsCreditorSideForms(userId, partnerId,
			PageRequest.of(0, 1000)).getContent();
		List<FormEntity> debtorForms = formRepository.findUserIsDebtorSideForms(userId, partnerId,
			PageRequest.of(0, 1000)).getContent();

		List<ContractWithPartnerResponse> responses = new ArrayList<>();

		creditorForms.stream()
			.filter(f -> f.getMaturityDate().isAfter(now))
			.map(f -> buildPartnerResponse(f, true))
			.forEach(responses::add);

		debtorForms.stream()
			.filter(f -> f.getMaturityDate().isAfter(now))
			.map(f -> buildPartnerResponse(f, false))
			.forEach(responses::add);

		return responses;
	}

	/**
	 * 특정 상태의 전체 계약을 사용자 기준으로 조회하여 요약 정보를 반환
	 */
	@Transactional
	public List<ContractPreviewResponse> selectAllContractByStatus(FormStatus formStatus, AuthUser authUser) {
		Page<FormEntity> allForms = formRepository.findAllWithFilters(authUser.getId(), formStatus, null,
			PageRequest.of(0, 1000));
		UserEntity user = getUser(authUser.getId());

		return allForms.stream()
			.map(form -> {
				ContractEntity contract = getContract(form);
				InterestResponse interest = selectInterestResponse(form.getId());
				boolean isCreditor = form.getCreditorName().equals(user.getUserName());
				String contracteeName = isCreditor ? form.getDebtorName() : form.getCreditorName();

				return ContractPreviewResponse.builder()
					.formId(form.getId())
					.status(form.getStatus())
					.userIsCreditor(isCreditor)
					.contracteeName(contracteeName)
					.maturityDate(form.getMaturityDate().toLocalDate())
					.nextRepaymentAmount(interest.getUnpaidAmount())
					.totalAmountDue(interest.getPaidPrincipalAmount() + interest.getPaidInterestAmount()
						+ interest.getPaidOverdueInterestAmount())
					.totalRepaymentAmount(interest.getExpectedPaymentAmountAtMaturity())
					.build();
			})
			.collect(Collectors.toList());
	}

	/**
	 * 사용자의 전체 송금 요약 정보를 계산 (송금한 금액, 받을 금액 등)
	 */
	@Transactional
	public AmountResponse selectAmounts(AuthUser authUser) {
		Page<FormEntity> forms = formRepository.findAllWithFilters(authUser.getId(), null, null,
			PageRequest.of(0, 1000));
		String username = authUser.getUsername();

		long paid = 0, expectedPay = 0, received = 0, expectedReceive = 0;

		for (FormEntity form : forms) {
			InterestResponse interest = selectInterestResponse(form.getId());
			if (form.getCreditorName().equals(username)) {
				received += interest.getPaidPrincipalAmount() + interest.getPaidInterestAmount()
					+ interest.getPaidOverdueInterestAmount();
				expectedReceive += interest.getExpectedPaymentAmountAtMaturity();
			} else {
				paid += interest.getPaidPrincipalAmount() + interest.getPaidInterestAmount()
					+ interest.getPaidOverdueInterestAmount();
				expectedPay += interest.getExpectedPaymentAmountAtMaturity();
			}
		}

		return AmountResponse.builder()
			.paidAmount(paid)
			.expectedTotalRepayment(expectedPay)
			.receivedAmount(received)
			.expectedTotalReceived(expectedReceive)
			.build();
	}

	/**
	 * 월별 납부 계획 데이터를 반환 (캘린더 뷰용)
	 */
	@Transactional
	public Map<Integer, MonthlyContractResponse> selectMonthlyContracts(AuthUser user, LocalDate now,
		LocalDate viewDate) {
		Map<Integer, MonthlyContractResponse> map = new HashMap<>();
		Page<FormEntity> forms = formRepository.findAllWithFilters(user.getId(), null, null, PageRequest.of(0, 1000));
		long monthGap = ChronoUnit.MONTHS.between(now.withDayOfMonth(1), viewDate.withDayOfMonth(1));

		for (FormEntity form : forms) {
			LocalDate maturity = form.getMaturityDate().toLocalDate();
			if (maturity.isBefore(viewDate))
				continue;

			int day = maturity.getDayOfMonth();
			MonthlyContractResponse daily = map.computeIfAbsent(day, d -> new MonthlyContractResponse());

			boolean isCreditor = form.getCreditorName().equals(user.getUsername());
			String contracteeName = isCreditor ? form.getDebtorName() : form.getCreditorName();
			ContractEntity contract = getContract(form);

			long repaymentAmount;

			if (monthGap == 0) {
				// 이번 달 납부 계획
				repaymentAmount = contract.getTotalEarlyRepaymentFee() > 0 ? 0L :
					calculateCurrentMonthRepayment(form, contract, viewDate);
			} else if (monthGap > 0) {
				// 미래 달 납부 계획
				repaymentAmount = calculateFutureMonthRepayment(form, contract, (int)monthGap);
			} else {
				// 과거 송금 내역
				repaymentAmount = calculatePastMonthPaidAmount(form, viewDate);
			}

			MonthlyContractDetail detail = MonthlyContractDetail.builder()
				.userIsCreditor(isCreditor)
				.contracteeName(contracteeName)
				.repaymentAmount(repaymentAmount)
				.build();

			daily.getContracts().add(detail);
		}

		return map;
	}

	/**
	 * 파트너와의 계약 응답 DTO 구성
	 */
	private ContractWithPartnerResponse buildPartnerResponse(FormEntity f, boolean isCreditor) {
		ContractEntity contract = getContract(f);
		ExpectedPaymentAmountResponse nextPayment = selectExpectedPaymentAmount(f.getId());
		return ContractWithPartnerResponse.builder()
			.userIsCreditor(isCreditor)
			.nextRepaymentAmount(nextPayment.getMonthlyRemainingPayment())
			.nextRepaymentDate(contract.getNextRepaymentDate())
			.contractDuration(f.getContractDate().toLocalDate() + " ~ " + f.getMaturityDate().toLocalDate())
			.build();
	}

	/**
	 * 중도상환 수수료 계산 로직
	 * - paymentDifference가 음수일 경우 0으로 간주
	 * - 수수료율은 계약서(form)에 정의된 수수료율 사용
	 */
	private long calculateEarlyRepaymentFee(long paymentDifference, FormEntity form) {
		BigDecimal safeDiff = BigDecimal.valueOf(Math.max(0, paymentDifference));
		return safeDiff.multiply(form.getEarlyRepaymentFeeRate()).longValue();
	}

	private long calculateCurrentMonthRepayment(FormEntity form, ContractEntity contract, LocalDate viewDate) {
		PaymentPreviewRequest request = new PaymentPreviewRequest(form);
		PaymentPreviewResponse preview = paymentPreviewService.calculatePaymentPreview(request, PageRequest.of(0, 100));

		Optional<PaymentScheduleResponse> schedule = preview.getSchedulePage().stream()
			.filter(p -> p.getInstallmentNumber().equals(contract.getCurrentPaymentRound()))
			.findFirst();

		long expected = schedule.map(PaymentScheduleResponse::getPaymentAmount).orElse(0L);
		long paid = transferRepository.findByForm(form).orElse(Collections.emptyList()).stream()
			.filter(t -> {
				LocalDate transferDate = t.getTransactionDate().toLocalDate();
				return transferDate.getYear() == viewDate.getYear()
					&& transferDate.getMonth() == viewDate.getMonth();
			})
			.mapToLong(TransferEntity::getAmount)
			.sum();

		long overdue = contract.getOverdueAmount();
		return Math.max(0, expected + overdue - paid);
	}

	private long calculateFutureMonthRepayment(FormEntity form, ContractEntity contract, int installmentNumber) {
		PaymentPreviewRequest request = new PaymentPreviewRequest(form);
		PaymentPreviewResponse preview = paymentPreviewService.calculatePaymentPreview(request, PageRequest.of(0, 100));

		return preview.getSchedulePage().stream()
			.filter(p -> p.getInstallmentNumber().intValue() == installmentNumber)
			.findFirst()
			.map(p -> p.getPaymentAmount() + contract.getOverdueAmount())
			.orElse(0L);
	}

	private long calculatePastMonthPaidAmount(FormEntity form, LocalDate viewDate) {
		return transferRepository.findByForm(form).orElse(Collections.emptyList()).stream()
			.filter(t -> {
				LocalDate transferDate = t.getTransactionDate().toLocalDate();
				return transferDate.getYear() == viewDate.getYear()
					&& transferDate.getMonth() == viewDate.getMonth();
			})
			.mapToLong(TransferEntity::getAmount)
			.sum();
	}

	// ===== Repository 조회 유틸 메서드 =====

	/** 계약서 ID로 FormEntity 조회 */
	private FormEntity getForm(Integer formId) {
		return formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
	}

	/** FormEntity로 연결된 계약 정보 조회 */
	private ContractEntity getContract(FormEntity form) {
		return contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
	}

	/** 사용자 ID로 사용자 정보 조회 */
	private UserEntity getUser(Integer userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
	}

	/** 계약서에 연결된 송금 내역 조회 */
	private List<TransferEntity> getTransfers(FormEntity form) {
		return transferRepository.findByForm(form)
			.orElseThrow(() -> new TransferException(ErrorCode.TRANSFER_NOT_FOUND));
	}
}