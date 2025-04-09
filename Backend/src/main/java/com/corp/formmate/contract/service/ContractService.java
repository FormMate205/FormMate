package com.corp.formmate.contract.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.corp.formmate.alert.service.AlertService;
import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractTransferResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.dto.MonthlyContractDetail;
import com.corp.formmate.contract.dto.TransferFormListResponse;
import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.contract.repository.ContractRepository;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.form.service.PaymentPreviewService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.paymentschedule.entity.PaymentScheduleEntity;
import com.corp.formmate.paymentschedule.service.PaymentScheduleService;
import com.corp.formmate.transfer.dto.TransferCreateRequest;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;
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
	private final UserRepository userRepository;
	private final AlertService alertService;
	private final PaymentScheduleService paymentScheduleService;
	private final PaymentPreviewService paymentPreviewService;

	/**
	 * 계약 상세 정보를 조회하는 메서드
	 * - 사용자 역할(채권자/채무자) 판단
	 * - 계약 상태에 따라 연체, 상환액, 중도상환 수수료 등을 종합적으로 계산하여 반환
	 */
	@Transactional
	public ContractDetailResponse selectContractDetail(Integer userId, Integer formId) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);
		UserEntity userEntity = getUser(userId);
		List<TransferEntity> transfers = getTransfers(form);

		boolean userIsCreditor = form.getCreditor().equals(userEntity);
		String contracteeName = userIsCreditor ? form.getDebtorName() : form.getCreditorName();

		// 현재까지 납부한 총액 (모든 송금 금액 합)
		long repaymentAmount = transfers.stream()
			.mapToLong(TransferEntity::getAmount)
			.sum();

		// 중도상환 상태인 송금 중, 수수료 대상인(paymentDifference > 0) 건들의 총 수수료
		long totalEarlyRepaymentCharge = transfers.stream()
			.filter(t -> t.getStatus() == TransferStatus.EARLY_REPAYMENT && t.getPaymentDifference() > 0)
			.mapToLong(t -> calculateEarlyRepaymentFee(t.getPaymentDifference(), form))
			.sum();

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
	 * - 이미 중도상환이 완료된 경우 납부할 금액은 0
	 */
	@Transactional
	public ExpectedPaymentAmountResponse selectExpectedPaymentAmount(Integer formId) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);
		List<PaymentScheduleEntity> paymentSchedules = paymentScheduleService.selectCurrentPaymentSchedule(contract);

		long monthlyRemaining = paymentSchedules.stream()
			.mapToLong(schedule -> {
				long total = schedule.getScheduledPrincipal()
					+ schedule.getScheduledInterest()
					+ schedule.getOverdueAmount();
				long paid = schedule.getActualPaidAmount() != null ? schedule.getActualPaidAmount() : 0L;
				return Math.max(0, total - paid);
			})
			.sum();

		return ExpectedPaymentAmountResponse.builder()
			.monthlyRemainingPayment(monthlyRemaining)
			.earlyRepaymentFeeRate(form.getEarlyRepaymentFeeRate())
			.build();
	}

	/**
	 * 계약에 대한 누적 이자 정보 및 예상 만기 납부금액 정보를 조회
	 * - 납부한 원금/이자/연체이자 및 중도상환 수수료 포함
	 * - 이번 회차 미납 금액 / 만기 납부 예상금액까지 포함
	 */
	@Transactional
	public InterestResponse selectInterestResponse(Integer formId) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);
		List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);

		long paidPrincipal = 0L;
		long paidInterest = 0L;
		long paidOverdueInterest = 0L;
		long totalEarlyRepaymentFee = 0L;
		long unpaidAmount = 0L;

		long remainingPrincipal = 0L;
		long remainingInterest = 0L;

		for (PaymentScheduleEntity schedule : schedules) {
			long scheduledPrincipal = schedule.getScheduledPrincipal();
			long scheduledInterest = schedule.getScheduledInterest();
			long overdueAmount = schedule.getOverdueAmount();
			long paid = schedule.getActualPaidAmount() != null ? schedule.getActualPaidAmount() : 0L;
			long scheduledTotal = scheduledPrincipal + scheduledInterest + overdueAmount;

			if (Boolean.TRUE.equals(schedule.getIsPaid())) {
				paidPrincipal += scheduledPrincipal;
				paidInterest += scheduledInterest;
				paidOverdueInterest += overdueAmount;
				totalEarlyRepaymentFee += schedule.getEarlyRepaymentFee();
			} else {
				unpaidAmount += Math.max(0, scheduledTotal - paid);
				remainingPrincipal += scheduledPrincipal;
				remainingInterest += scheduledInterest;
			}
		}

		long maturityPayment = paidPrincipal + paidInterest + paidOverdueInterest
			+ unpaidAmount; // 전체 실제 납부 + 앞으로 납부해야 할 것

		return InterestResponse.builder()
			.paidPrincipalAmount(paidPrincipal)
			.paidInterestAmount(paidInterest)
			.paidOverdueInterestAmount(paidOverdueInterest)
			.totalEarlyRepaymentFee(totalEarlyRepaymentFee)
			.unpaidAmount(unpaidAmount)
			.expectedPaymentAmountAtMaturity(maturityPayment)
			.expectedPrincipalAmountAtMaturity(remainingPrincipal)
			.expectedInterestAmountAtMaturity(remainingInterest)
			.build();
	}

	/**
	 * 특정 사용자와 상대방 간의 계약을 반환 (채권자/채무자 구분 포함)
	 */
	@Transactional
	public List<ContractWithPartnerResponse> selectContractWithPartner(Integer userId, Integer partnerId) {
		List<FormEntity> creditorForms = formRepository.findUserIsCreditorSideForms(
			userId, partnerId, PageRequest.of(0, 1000)).getContent();
		List<FormEntity> debtorForms = formRepository.findUserIsDebtorSideForms(
			userId, partnerId, PageRequest.of(0, 1000)).getContent();

		List<ContractWithPartnerResponse> responses = new ArrayList<>();

		// 상태가 IN_PROGRESS or OVERDUE인 Form만 처리
		creditorForms.stream()
			.filter(f -> f.getStatus() == FormStatus.IN_PROGRESS || f.getStatus() == FormStatus.OVERDUE)
			.map(f -> buildPartnerResponse(f, true))
			.forEach(responses::add);

		debtorForms.stream()
			.filter(f -> f.getStatus() == FormStatus.IN_PROGRESS || f.getStatus() == FormStatus.OVERDUE)
			.map(f -> buildPartnerResponse(f, false))
			.forEach(responses::add);

		return responses;
	}

	/**
	 * 특정 상태의 전체 계약(사용자 기준) 조회 → 요약 정보 반환
	 */
	@Transactional
	public List<ContractPreviewResponse> selectAllContractByStatus(FormStatus formStatus, Integer userId) {
		Page<FormEntity> allForms = formRepository.findAllWithFilters(
			userId, formStatus, null, PageRequest.of(0, 1000));
		UserEntity user = getUser(userId);

		return allForms.stream()
			.map(form -> {
				boolean isCreditor = form.getCreditor().equals(user);
				String contracteeName = isCreditor ? form.getDebtorName() : form.getCreditorName();

				// 기본값
				long nextAmount = 0L;
				long totalPaid = 0L;
				long totalRemaining = 0L;

				// 상태별 분기 처리
				if (form.getStatus() == FormStatus.IN_PROGRESS ||
					form.getStatus() == FormStatus.OVERDUE ||
					form.getStatus() == FormStatus.COMPLETED) {

					ContractEntity contract = getContract(form);
					List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);

					// 납부 금액 합
					totalPaid = schedules.stream()
						.mapToLong(s -> s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L)
						.sum();

					// 남은 금액 합
					totalRemaining = schedules.stream()
						.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
						.mapToLong(s -> {
							long total = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();
							long paid = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
							return Math.max(0, total - paid);
						})
						.sum();

					// 진행 중, 연체만 납부할 회차 추출
					if (form.getStatus() == FormStatus.IN_PROGRESS || form.getStatus() == FormStatus.OVERDUE) {
						nextAmount = calculateNextRepaymentAmount(contract, schedules);
					}
				}

				return ContractPreviewResponse.builder()
					.formId(form.getId())
					.status(form.getStatus())
					.userIsCreditor(isCreditor)
					.contracteeName(contracteeName)
					.maturityDate(form.getMaturityDate().toLocalDate())
					.nextRepaymentAmount(nextAmount)
					.totalRepaymentAmount(totalPaid)
					.totalAmountDue(totalPaid + totalRemaining)
					.build();
			})
			.collect(Collectors.toList());
	}

	/**
	 * 사용자의 전체 송금 요약 정보를 계산
	 */
	@Transactional
	public AmountResponse selectAmounts(Integer userId) {
		Page<FormEntity> forms = formRepository.findAllWithFilters(
			userId, null, null, PageRequest.of(0, 1000));
		UserEntity user = getUser(userId);

		long paid = 0L, expectedPay = 0L, received = 0L, expectedReceive = 0L;

		for (FormEntity form : forms) {
			FormStatus status = form.getStatus();

			if (status == FormStatus.BEFORE_APPROVAL || status == FormStatus.AFTER_APPROVAL
				|| status == FormStatus.COMPLETED) {
				continue; // 스케줄 없음
			}

			ContractEntity contract = getContract(form);
			List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);
			boolean isCreditor = form.getCreditor().equals(user);

			for (PaymentScheduleEntity s : schedules) {
				long scheduled = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();
				long actual = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
				long unpaid = Math.max(0, scheduled - actual);

				if (Boolean.TRUE.equals(s.getIsPaid())) {
					// 납부된 금액은 상태 상관없이 집계
					if (isCreditor)
						received += actual;
					else
						paid += actual;
				} else {
					if (isCreditor)
						expectedReceive += unpaid;
					else
						expectedPay += unpaid;
				}
			}
		}

		return AmountResponse.builder()
			.paidAmount(paid)
			.expectedTotalRepayment(paid + expectedPay)
			.receivedAmount(received)
			.expectedTotalReceived(received + expectedReceive)
			.build();
	}

	/**
	 * 월별 납부 계획(캘린더 뷰) 반환
	 *  - 이 로직도 전부 EnhancedPaymentPreviewService 스케줄을 활용해서 계산합니다.
	 */
	@Transactional
	public List<MonthlyContractDetail> selectMonthlyContracts(Integer userId, LocalDate viewDate) {
		// 3개월 범위 계산
		YearMonth prevMonth = YearMonth.from(viewDate).minusMonths(1);
		YearMonth currMonth = YearMonth.from(viewDate);
		YearMonth nextMonth = YearMonth.from(viewDate).plusMonths(1);
		List<YearMonth> targetMonths = List.of(prevMonth, currMonth, nextMonth);

		List<MonthlyContractDetail> allDetails = new ArrayList<>();
		UserEntity userEntity = getUser(userId);
		LocalDate today = LocalDate.now();

		// 진행중, 연체 중인 계약만
		List<FormEntity> allForms = formRepository.findAllByStatuses(userId,
			List.of(FormStatus.IN_PROGRESS, FormStatus.OVERDUE));

		for (FormEntity form : allForms) {
			ContractEntity contract = getContract(form);
			List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);

			boolean isCreditor = form.getCreditor().equals(userEntity);
			String contracteeName = isCreditor ? form.getDebtorName() : form.getCreditorName();

			for (PaymentScheduleEntity s : schedules) {
				LocalDate paymentDate = s.getScheduledPaymentDate().toLocalDate();
				YearMonth ym = YearMonth.from(paymentDate);
				if (!targetMonths.contains(ym))
					continue;

				long scheduled = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();
				long actual = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
				long unpaid = Math.max(0, scheduled - actual);

				if (paymentDate.isBefore(today)) {
					// 과거: 실제 납부 내역
					if (actual > 0) {
						allDetails.add(MonthlyContractDetail.builder()
							.userIsCreditor(isCreditor)
							.contracteeName(contracteeName)
							.repaymentAmount(actual)
							.scheduledPaymentDate(paymentDate)
							.build());
					}
				} else if (paymentDate.isAfter(today)) {
					// 미래: 예정 납부 내역
					if (!Boolean.TRUE.equals(s.getIsPaid()) && unpaid > 0) {
						allDetails.add(MonthlyContractDetail.builder()
							.userIsCreditor(isCreditor)
							.contracteeName(contracteeName)
							.repaymentAmount(unpaid)
							.scheduledPaymentDate(paymentDate)
							.build());
					}
				} else {
					// ✅ 오늘 날짜: 과거 + 미래 둘 다
					if (actual > 0) {
						allDetails.add(MonthlyContractDetail.builder()
							.userIsCreditor(isCreditor)
							.contracteeName(contracteeName)
							.repaymentAmount(actual)
							.scheduledPaymentDate(paymentDate)
							.build());
					}
					if (!Boolean.TRUE.equals(s.getIsPaid()) && unpaid > 0) {
						allDetails.add(MonthlyContractDetail.builder()
							.userIsCreditor(isCreditor)
							.contracteeName(contracteeName)
							.repaymentAmount(unpaid)
							.scheduledPaymentDate(paymentDate)
							.build());
					}
				}
			}
		}

		return allDetails;
	}

	//	@Transactional
	//	public void dailyContractUpdateJob() {
	//		LocalDate today = LocalDate.now();
	//
	//		// 1) 진행중(IN_PROGRESS) 또는 연체(OVERDUE) 상태인 Form 조회
	//		List<FormEntity> targetForms = formRepository.findByStatusIn(
	//			Arrays.asList(FormStatus.IN_PROGRESS, FormStatus.OVERDUE)
	//		);
	//
	//		for (FormEntity form : targetForms) {
	//			// 해당 Form에 연결된 Contract 조회
	//			ContractEntity contract = contractRepository.findByForm(form)
	//				.orElse(null);
	//			if (contract == null) {
	//				continue;
	//			}
	//
	//			LocalDate nextDueDate = contract.getNextRepaymentDate();
	//			if (nextDueDate == null) {
	//				// nextRepaymentDate가 없다면 스킵 (또는 완납/만기 등)
	//				continue;
	//			}
	//
	//			// 2) nextRepaymentDate가 지났다면(어제 날짜보다 이전)
	//			if (nextDueDate.isBefore(today)) {
	//				// 이번 회차 납부가 완납되었는지 체크
	//				boolean fullyPaid = checkIfFullyPaid(form, contract);
	//				if (!fullyPaid) {
	//					// => 연체 처리
	//					handleOverdue(form, contract);
	//				} else {
	//					// => 완납이면 다음 회차로 이동
	//					moveToNextRound(form, contract);
	//				}
	//			}
	//
	//			// 3) 만약 이미 OVERDUE 상태인데 납부 완료로 연체 해소되었다면 → 다시 IN_PROGRESS
	//			//   (혹은 overdueAmount=0이 되었는지 체크)
	//			if (form.getStatus() == FormStatus.OVERDUE) {
	//				boolean isOverdueCleared = checkIfOverdueCleared(form, contract);
	//				if (isOverdueCleared) {
	//					form.updateStatus(FormStatus.IN_PROGRESS);
	//					// 필요하다면 overdueAmount=0 등 리셋
	//					contract.setOverdueAmount(0L);
	//					contractRepository.save(contract);
	//					formRepository.save(form);
	//				}
	//			}
	//		}
	//	}

	/**
	 * 이번 회차(Contract.currentPaymentRound)에 대해
	 * 실제 납부(Transfer) 합계가 스케줄상의 납부액보다 큰지 검사
	 */
	//	private boolean checkIfFullyPaid(FormEntity form, ContractEntity contract) {
	//		int round = contract.getCurrentPaymentRound();
	//
	//		// 1) 스케줄에서 이번 회차 납부 예정액 가져오기
	//		EnhancedPaymentPreviewResponse preview = enhancedPaymentPreviewService.calculateEnhancedPaymentPreview(form,
	//			contract);
	//		long scheduledAmount = preview.getScheduleList().stream()
	//			.filter(s -> s.getInstallmentNumber() == round)
	//			.findFirst()
	//			.map(EnhancedPaymentScheduleResponse::getPaymentAmount)
	//			.orElse(0L);
	//
	//		// 2) 실제 납부액(Transfer) 합
	//		List<TransferEntity> transfers = transferRepository.findByForm(form).orElse(Collections.emptyList());
	//		long paid = transfers.stream()
	//			.filter(t -> t.getCurrentRound() == round)
	//			.mapToLong(TransferEntity::getAmount)
	//			.sum();
	//
	//		return (paid >= scheduledAmount);
	//	}

	/**
	 * 연체 처리
	 * - Form 상태를 OVERDUE로
	 * - 연체 횟수(overdueCount) 증가
	 * - overdueAmount = "미납액"
	 */
	//	private void handleOverdue(FormEntity form, ContractEntity contract) {
	//		form.updateStatus(FormStatus.OVERDUE);
	//
	//		// overdueCount++
	//		contract.setOverdueCount(contract.getOverdueCount() + 1);
	//
	//		// 이번 회차 스케줄액 - 실제 납부액 = overdueAmount
	//		int round = contract.getCurrentPaymentRound();
	//		EnhancedPaymentPreviewResponse preview = enhancedPaymentPreviewService.calculateEnhancedPaymentPreview(form,
	//			contract);
	//		long scheduledAmount = preview.getScheduleList().stream()
	//			.filter(s -> s.getInstallmentNumber() == round)
	//			.findFirst()
	//			.map(EnhancedPaymentScheduleResponse::getPaymentAmount)
	//			.orElse(0L);
	//
	//		List<TransferEntity> transfers = transferRepository.findByForm(form).orElse(Collections.emptyList());
	//		long paid = transfers.stream()
	//			.filter(t -> t.getCurrentRound() == round)
	//			.mapToLong(TransferEntity::getAmount)
	//			.sum();
	//
	//		long notPaid = Math.max(0, scheduledAmount - paid);
	//		contract.setOverdueAmount(notPaid);
	//
	//		NumberFormat formatter = NumberFormat.getNumberInstance();
	//		String formattedNotPaid = formatter.format(notPaid);
	//
	//		// 연체 이자(누적) 등 추가 계산이 있으면 여기서 수행
	//		// ex) contract.setOverdueInterestAmount( contract.getOverdueInterestAmount() + something );
	//
	//		String creditorName = form.getCreditorName();
	//		String debtorName = form.getDebtorName();
	//
	//		alertService.createAlert(
	//			form.getDebtor(),
	//			"연체",
	//			"연체가 발생했습니다!",
	//			creditorName + "님께 " + formattedNotPaid + "원을 이체하세요"
	//		);
	//
	//		// 받을 사람 (채권자)
	//		alertService.createAlert(
	//			form.getCreator(),
	//			"연체",
	//			"연체가 발생했습니다!",
	//			debtorName + "님께서 " + formattedNotPaid + "원을 아직 송금하지 않았어요"
	//		);
	//
	//		// DB 저장
	//		contractRepository.save(contract);
	//		formRepository.save(form);
	//	}

	/**
	 * 다음 회차로 이동
	 * - currentPaymentRound++
	 * - nextRepaymentDate = 다음 회차의 paymentDate(없으면 만기 처리)
	 * - 만약 이전에 연체였다면 해소
	 */
	//	private void moveToNextRound(FormEntity form, ContractEntity contract) {
	//		int round = contract.getCurrentPaymentRound();
	//		contract.setCurrentPaymentRound(round + 1);
	//
	//		// 다음 회차 스케줄
	//		EnhancedPaymentPreviewResponse preview = enhancedPaymentPreviewService
	//			.calculateEnhancedPaymentPreview(form, contract);
	//
	//		Optional<EnhancedPaymentScheduleResponse> nextScheduleOpt = preview.getScheduleList().stream()
	//			.filter(s -> s.getInstallmentNumber() == (round + 1))
	//			.findFirst();
	//
	//		if (nextScheduleOpt.isPresent()) {
	//			// 다음 회차 납부일
	//			LocalDateTime nextPayDate = nextScheduleOpt.get().getPaymentDate();
	//			contract.setNextRepaymentDate(nextPayDate.toLocalDate());
	//		} else {
	//			// 더 이상 회차가 없다면 => 만기
	//			form.updateStatus(FormStatus.COMPLETED);
	//			log.info("moveToNextRound: 모든 회차 완료 -> COMPLETED");
	//		}
	//
	//		// 만약 이전에 연체였는데 이번 회차 완납으로 해소됐을 수 있으므로
	//		// overdueAmount=0
	//		contract.setOverdueAmount(0L);
	//		if (form.getStatus() == FormStatus.OVERDUE) {
	//			form.updateStatus(FormStatus.IN_PROGRESS);
	//		}
	//
	//		contractRepository.save(contract);
	//		formRepository.save(form);
	//	}

	/**
	 * 연체가 해소됐는지 체크
	 * - overdueAmount=0인가?
	 * - 혹은 이번 회차 납부분도 충분?
	 */
	private boolean checkIfOverdueCleared(FormEntity form, ContractEntity contract) {
		if (contract.getOverdueAmount() > 0) {
			return false;
		}
		// 2) 만약 여러 회차에 걸쳐 연체될 가능성이 있다면?
		//    "모든 과거 회차가 납부 완료"인지 검사하는 식의 로직도 가능

		// 3) 연체 이자를 별도로 추적한다면 "연체 이자도 모두 납부되었는지" 확인
		// if (contract.getOverdueInterestAmount() > someThreshold) {
		//     return false;
		// }

		// 여기서는 간단히 "overdueAmount == 0이면 해소"로 가정
		return true;
	}

	/**
	 * 파트너와의 계약 응답 DTO 구성
	 */
	private ContractWithPartnerResponse buildPartnerResponse(FormEntity form, boolean isCreditor) {
		ContractEntity contract = getContract(form);
		Integer currentRound = contract.getCurrentPaymentRound();

		List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);
		List<PaymentScheduleEntity> unpaidSchedules = schedules.stream()
			.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
			.toList();

		// 1. 연체 상태
		List<PaymentScheduleEntity> overdueSchedules = unpaidSchedules.stream()
			.filter(PaymentScheduleEntity::getIsOverdue)
			.toList();

		if (!overdueSchedules.isEmpty()) {
			long total = overdueSchedules.stream()
				.mapToLong(s -> {
					long scheduled = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();
					long paid = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
					return Math.max(0, scheduled - paid);
				})
				.sum();

			LocalDate earliestDate = overdueSchedules.stream()
				.map(s -> s.getScheduledPaymentDate().toLocalDate())
				.min(LocalDate::compareTo)
				.orElse(null);

			return ContractWithPartnerResponse.builder()
				.formId(form.getId())
				.userIsCreditor(isCreditor)
				.nextRepaymentAmount(total)
				.nextRepaymentDate(earliestDate)
				.contractDuration(form.getContractDate() + " ~ " + form.getMaturityDate())
				.build();
		}

		// 2. currentRound 미납 상태
		PaymentScheduleEntity current = unpaidSchedules.stream()
			.filter(s -> s.getPaymentRound().equals(currentRound))
			.findFirst()
			.orElse(null);

		if (current != null) {
			long scheduled =
				current.getScheduledPrincipal() + current.getScheduledInterest() + current.getOverdueAmount();
			long paid = current.getActualPaidAmount() != null ? current.getActualPaidAmount() : 0L;

			return ContractWithPartnerResponse.builder()
				.formId(form.getId())
				.userIsCreditor(isCreditor)
				.nextRepaymentAmount(Math.max(0, scheduled - paid))
				.nextRepaymentDate(current.getScheduledPaymentDate().toLocalDate())
				.contractDuration(form.getContractDate() + " ~ " + form.getMaturityDate())
				.build();
		}

		// 3. 중도상환 후 이후 회차 중 첫 번째 미납 회차
		PaymentScheduleEntity next = unpaidSchedules.stream()
			.filter(s -> s.getPaymentRound() > currentRound)
			.min(Comparator.comparingInt(PaymentScheduleEntity::getPaymentRound))
			.orElse(null);

		if (next != null) {
			long scheduled = next.getScheduledPrincipal() + next.getScheduledInterest() + next.getOverdueAmount();
			long paid = next.getActualPaidAmount() != null ? next.getActualPaidAmount() : 0L;

			return ContractWithPartnerResponse.builder()
				.formId(form.getId())
				.userIsCreditor(isCreditor)
				.nextRepaymentAmount(Math.max(0, scheduled - paid))
				.nextRepaymentDate(next.getScheduledPaymentDate().toLocalDate())
				.contractDuration(form.getContractDate() + " ~ " + form.getMaturityDate())
				.build();
		}

		// 모든 회차 납부 완료
		return ContractWithPartnerResponse.builder()
			.formId(form.getId())
			.userIsCreditor(isCreditor)
			.nextRepaymentAmount(0L)
			.nextRepaymentDate(null)
			.contractDuration(form.getContractDate() + " ~ " + form.getMaturityDate())
			.build();
	}

	/**
	 * 중도상환 수수료 계산
	 */
	private long calculateEarlyRepaymentFee(long paymentDifference, FormEntity form) {
		BigDecimal safeDiff = BigDecimal.valueOf(Math.max(0, paymentDifference));
		return safeDiff.multiply(form.getEarlyRepaymentFeeRate()).longValue();
	}

	// ──────────────── 레포지토리 조회 유틸 메서드 ────────────────

	private FormEntity getForm(Integer formId) {
		return formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
	}

	private ContractEntity getContract(FormEntity form) {
		return contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
	}

	private UserEntity getUser(Integer userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
	}

	private List<TransferEntity> getTransfers(FormEntity form) {
		return transferRepository.findByForm(form)
			.orElse(Collections.emptyList());
	}

	/**
	 * 신규 계약(Contract) 생성 시
	 * - EnhancedPaymentPreviewService를 통해 전체 회차 스케줄을 받아 총 원금/이자 설정
	 */
	@Transactional
	public void createContract(FormEntity form) {

		// 납부 스케줄 계산
		PaymentPreviewRequest previewRequest = PaymentPreviewRequest.builder()
			.loanAmount(form.getLoanAmount())
			.interestRate(form.getInterestRate().toString())
			.repaymentMethod(form.getRepaymentMethod().getKorName())
			.repaymentDay(form.getRepaymentDay())
			.maturityDate(form.getMaturityDate())
			.build();

		log.info("5-1. previewRequest 종료");

		PaymentPreviewResponse preview = paymentPreviewService.calculatePaymentPreview(previewRequest,
			PageRequest.of(0, 10000));

		log.info("5-2. preview 종료");

		LocalDate firstScheduleDate = preview.getSchedulePage().getContent().stream()
			.findFirst()
			.map(s -> s.getPaymentDate().toLocalDate())
			.orElseThrow(() -> new ContractException(ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND));

		log.info("5-3. firstScheduleDate 종료");

		ContractEntity contract = ContractEntity.builder()
			.form(form)
			.overdueCount(0)
			.overdueAmount(0L)
			.earlyRepaymentCount(0)
			.totalEarlyRepaymentFee(0L)
			.remainingPrincipal(form.getLoanAmount())
			.remainingPrincipalMinusOverdue(form.getLoanAmount())
			.interestAmount(0L)
			.overdueInterestAmount(0L)
			.nextRepaymentDate(firstScheduleDate)
			.build();

		// 만기 원금/이자 설정
		long maturityPrincipal = preview.getSchedulePage().getContent().stream()
			.mapToLong(s -> s.getPrincipal()).sum();

		long maturityInterest = preview.getSchedulePage().getContent().stream()
			.mapToLong(s -> s.getInterest()).sum();

		log.info("5-4. 만기 원금/이자 설정 종료");

		contract.setExpectedMaturityPayment(maturityPrincipal);
		contract.setExpectedInterestAmountAtMaturity(maturityInterest);

		log.info("5-5. set 종료");

		// 계약 저장
		contractRepository.save(contract);

		log.info("5-6. 계약 저장 종료");

		// 스케줄 저장
		paymentScheduleService.createSchedules(form, contract, preview);

		log.info("5-7. 스케줄 저장 종료");
	}

	public ContractEntity selectTransferByForm(FormEntity form) {
		return contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
	}

	/**
	 * 송금 생성 시 계약 상태 업데이트 (정상 납부 / 중도상환 / 연체 등) 처리
	 */
	@Transactional
	public void updateContract(TransferCreateRequest request) {
		FormEntity form = getForm(request.getFormId());
		ContractEntity contract = getContract(form);

		long leftover = request.getAmount();
		log.info("===== updateContract: leftover(송금액) = {}", leftover);

		// 스케줄 처리 + 계약 필드 동기화까지 포함
		List<PaymentScheduleEntity> schedules = paymentScheduleService
			.updateSchedulesForRepaymentAndReturnUpdated(contract, form, leftover);

		// 계약 정보 갱신 (스케줄 기반)
		long remainingPrincipal = schedules.stream()
			.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
			.mapToLong(PaymentScheduleEntity::getScheduledPrincipal)
			.sum();
		long totalPaidInterest = schedules.stream()
			.filter(PaymentScheduleEntity::getIsPaid)
			.mapToLong(PaymentScheduleEntity::getScheduledInterest)
			.sum();
		long totalPaidOverdueInterest = schedules.stream()
			.filter(PaymentScheduleEntity::getIsPaid)
			.mapToLong(PaymentScheduleEntity::getOverdueAmount)
			.sum();
		long totalEarlyRepaymentFee = schedules.stream()
			.mapToLong(PaymentScheduleEntity::getEarlyRepaymentFee)
			.sum();
		long totalOverdueAmount = schedules.stream()
			.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
			.mapToLong(PaymentScheduleEntity::getOverdueAmount)
			.sum();

		contract.setRemainingPrincipal(remainingPrincipal);
		contract.setRemainingPrincipalMinusOverdue(Math.max(0, remainingPrincipal - totalOverdueAmount));
		contract.setInterestAmount(totalPaidInterest);
		contract.setOverdueInterestAmount(totalPaidOverdueInterest);
		contract.setTotalEarlyRepaymentFee(totalEarlyRepaymentFee);

		// 모든 회차 납부 완료 시 상태 변경
		boolean allPaid = schedules.stream().allMatch(PaymentScheduleEntity::getIsPaid);
		if (allPaid) {
			form.updateStatus(FormStatus.COMPLETED);
		} else {
			// ✅ 연체 회차가 모두 납부되었으면 상태 복구
			boolean hasOverdueRemaining = schedules.stream()
				.anyMatch(s -> !Boolean.TRUE.equals(s.getIsPaid()) && Boolean.TRUE.equals(s.getIsOverdue()));

			if (!hasOverdueRemaining && form.getStatus() == FormStatus.OVERDUE) {
				form.updateStatus(FormStatus.IN_PROGRESS);
			}
		}

		contractRepository.save(contract);
		formRepository.save(form);
	}

	/**
	 * 과거 달(ym)에 해당하는 모든 Transfer 내역을 찾아,
	 * "송금 일자"를 scheduledPaymentDate로, 송금 금액을 repaymentAmount로 하는
	 * 여러 MonthlyContractDetail을 생성
	 */
	private List<MonthlyContractDetail> findTransferDetailsForMonth(
		FormEntity form, YearMonth ym,
		boolean isCreditor, String contracteeName
	) {
		List<MonthlyContractDetail> details = new ArrayList<>();

		List<TransferEntity> transfers = transferRepository.findByForm(form)
			.orElse(Collections.emptyList());

		// 이 달(ym)에 해당하는 모든 Transfer를 찾아서
		// 각각 detail로 매핑
		transfers.stream()
			.filter(t -> {
				LocalDate txDate = t.getTransactionDate().toLocalDate();
				return YearMonth.from(txDate).equals(ym);
			})
			.forEach(t -> {
				MonthlyContractDetail detail = MonthlyContractDetail.builder()
					.userIsCreditor(isCreditor)
					.contracteeName(contracteeName)
					.repaymentAmount(t.getAmount()) // 실제 송금액
					.scheduledPaymentDate(t.getTransactionDate().toLocalDate()) // 실제 송금일
					.build();

				details.add(detail);
			});

		return details;
	}

	/**
	 * 현재나 미래 달(ym)에 대해서, EnhancedPaymentPreviewService 스케줄에서
	 * "paymentDate가 ym에 속하는 모든 회차"를 찾아
	 * Detail을 여러 개 생성
	 */
	//	private List<MonthlyContractDetail> computeDetailsFromPreview(
	//		FormEntity form, ContractEntity contract, YearMonth ym,
	//		boolean isCreditor, String contracteeName
	//	) {
	//		List<MonthlyContractDetail> details = new ArrayList<>();
	//
	//		EnhancedPaymentPreviewResponse preview = enhancedPaymentPreviewService
	//			.calculateEnhancedPaymentPreview(form, contract);
	//
	//		// 스케줄 중에서 "paymentDate의 YearMonth가 ym"인 회차들을 추출
	//		preview.getScheduleList().stream()
	//			.filter(s -> YearMonth.from(s.getPaymentDate().toLocalDate()).equals(ym))
	//			.forEach(s -> {
	//				// 회차별 날짜(s.getPaymentDate()) 를 scheduledPaymentDate로
	//				// 납부 예정액(s.getPaymentAmount())를 repaymentAmount로
	//				MonthlyContractDetail detail = MonthlyContractDetail.builder()
	//					.userIsCreditor(isCreditor)
	//					.contracteeName(contracteeName)
	//					.repaymentAmount(s.getPaymentAmount())
	//					.scheduledPaymentDate(s.getPaymentDate().toLocalDate())
	//					.build();
	//
	//				details.add(detail);
	//			});
	//
	//		return details;
	//	}
	private long clearOverdueIfAny(FormEntity form, ContractEntity contract, long leftover) {
		long result = leftover;

		long odAmount = contract.getOverdueAmount();
		if (odAmount > 0) {
			// 여기서는 overdueAmount에 "원금+연체이자"가 섞여있다고 가정
			// 더 정교하게 "overdueInterestAmount"를 별도 필드로 관리하려면, 이자→원금 순으로 더 세밀히 처리

			if (result >= odAmount) {
				// 연체액 전부 해소
				result -= odAmount;
				contract.setOverdueAmount(0L);

				// 상태를 IN_PROGRESS 복귀
				form.updateStatus(FormStatus.IN_PROGRESS);
			} else {
				// 부분 해소
				long remain = odAmount - result;
				contract.setOverdueAmount(remain);
				result = 0;
				// 아직 연체 중
				form.updateStatus(FormStatus.OVERDUE);
			}
		}

		// result = "연체 차감 후 남은 돈"
		return result;
	}

	private long calculateNextRepaymentAmount(ContractEntity contract, List<PaymentScheduleEntity> schedules) {
		Integer currentRound = contract.getCurrentPaymentRound();

		List<PaymentScheduleEntity> unpaid = schedules.stream()
			.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
			.toList();

		List<PaymentScheduleEntity> overdue = unpaid.stream()
			.filter(PaymentScheduleEntity::getIsOverdue)
			.toList();

		if (!overdue.isEmpty()) {
			return overdue.stream()
				.mapToLong(s -> {
					long total = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();
					long paid = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
					return Math.max(0, total - paid);
				})
				.sum();
		}

		PaymentScheduleEntity current = unpaid.stream()
			.filter(s -> s.getPaymentRound().equals(currentRound))
			.findFirst()
			.orElse(null);

		if (current != null) {
			long total = current.getScheduledPrincipal() + current.getScheduledInterest() + current.getOverdueAmount();
			long paid = current.getActualPaidAmount() != null ? current.getActualPaidAmount() : 0L;
			return Math.max(0, total - paid);
		}

		PaymentScheduleEntity next = unpaid.stream()
			.filter(s -> s.getPaymentRound() > currentRound)
			.min(Comparator.comparingInt(PaymentScheduleEntity::getPaymentRound))
			.orElse(null);

		if (next != null) {
			long total = next.getScheduledPrincipal() + next.getScheduledInterest() + next.getOverdueAmount();
			long paid = next.getActualPaidAmount() != null ? next.getActualPaidAmount() : 0L;
			return Math.max(0, total - paid);
		}

		return 0L;
	}

	@Transactional
	public List<ContractTransferResponse> selectContractTransfers(Integer userId, String name) {
		UserEntity userEntity = getUser(userId);
		String trimmedName = name != null ? name.trim() : null;

		return formRepository.findAllByStatuses(userId,
				List.of(FormStatus.IN_PROGRESS, FormStatus.OVERDUE)).stream()

			// 본인이 채무자인 경우에만 동작
			.filter(form -> form.getDebtor().equals(userEntity))

			// 이름 필터 조건 추가 (name이 있을 경우만)
			.filter(form -> {
				if (trimmedName == null || trimmedName.isBlank())
					return true;
				String partnerName = form.getCreditorName();
				return partnerName != null && partnerName.contains(trimmedName);
			})

			// 매핑
			.map(form -> {
				ContractEntity contract = getContract(form);
				PaymentScheduleEntity paymentSchedule = paymentScheduleService.selectNextScheduleByContract(contract);

				return ContractTransferResponse.builder()
					.formId(form.getId())
					.partnerId(form.getCreditor().getId())
					.partnerName(form.getCreditorName())
					.nextRepaymentDate(paymentSchedule.getScheduledPaymentDate().toLocalDate())
					.build();
			})

			// 리스트로 수집
			.collect(Collectors.toList());
	}

	@Transactional
	public Page<TransferFormListResponse> selectFormTransfers(Integer formId, String status, Pageable pageable) {
		FormEntity form = getForm(formId);
		ContractEntity contract = getContract(form);

		List<TransferEntity> transfers = transferRepository.findByForm(form).orElse(List.of());
		Map<Integer, List<TransferEntity>> transfersByRound = transfers.stream()
			.collect(Collectors.groupingBy(TransferEntity::getCurrentRound));

		List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);

		List<TransferFormListResponse> responses = new ArrayList<>();

		// 1. Transfer 기반 내역 생성
		for (TransferEntity t : transfers) {
			responses.add(TransferFormListResponse.builder()
				.status(t.getStatus().getKorName())
				.currentRound(t.getCurrentRound())
				.amount(t.getAmount())
				.paymentDifference(t.getPaymentDifference())
				.transactionDate(t.getTransactionDate())
				.build());
		}

		// 2. 스케줄 기반 중도상환 내역 추가
		Set<Integer> transferredRounds = transfersByRound.keySet();

		for (PaymentScheduleEntity s : schedules) {
			Integer round = s.getPaymentRound();

			if (s.getIsPaid() && s.getActualPaidAmount() != null && s.getActualPaidAmount() == 0L
				&& !transferredRounds.contains(round)) {
				responses.add(TransferFormListResponse.builder()
					.status("중도상환")
					.currentRound(round)
					.amount(0L)
					.paymentDifference(0L)
					.transactionDate(s.getScheduledPaymentDate()) // or s.getActualPaidDate()
					.build());
			}
		}

		// 3. 상태 필터링
		Stream<TransferFormListResponse> stream = responses.stream();
		if (!"전체".equals(status)) {
			stream = stream.filter(r -> r.getStatus().equals(status));
		}

		List<TransferFormListResponse> filtered = stream.toList();

		// 4. 페이징 처리
		int start = (int)pageable.getOffset();
		int end = Math.min(start + pageable.getPageSize(), filtered.size());
		List<TransferFormListResponse> pageContent = filtered.subList(start, end);

		return new PageImpl<>(pageContent, pageable, filtered.size());
	}

	//	public void notifyRepaymentDueContracts() {
	//		List<ContractEntity> dueContracts = contractRepository.findByNextRepaymentDate(LocalDate.now());
	//		for (ContractEntity contract : dueContracts) {
	//			FormEntity form = contract.getForm();
	//			String senderName = form.getDebtorName();
	//			String receiverName = form.getCreditorName();
	//			Long amount = enhancedPaymentPreviewService.getCurrentRoundAmount(form, contract);
	//			NumberFormat formatter = NumberFormat.getNumberInstance();
	//			String formattedAmount = formatter.format(amount);
	//
	//			// 알림 - 보낼 사람 (채무자)
	//			alertService.createAlert(
	//				form.getDebtor(),
	//				"상환일",
	//				"오늘은 상환일입니다!",
	//				receiverName + "님께 " + formattedAmount + "원을 상환하세요"
	//			);
	//
	//			// 알림 - 받는 사람 (채권자)
	//			alertService.createAlert(
	//				form.getCreditor(),
	//				"상환일",
	//				"오늘은 상환일입니다!",
	//				senderName + "님께서 " + formattedAmount + "원을 상환할 예정입니다"
	//			);
	//		}
	//	}
}