package com.corp.formmate.contract.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
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
import com.corp.formmate.paymentschedule.repository.PaymentScheduleRepository;
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
	private final PaymentScheduleRepository paymentScheduleRepository;

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
		List<PaymentScheduleEntity> schedules = paymentScheduleService.selectByContract(contract);

		boolean userIsCreditor = form.getCreditor().equals(userEntity);
		String contracteeName = userIsCreditor ? form.getDebtorName() : form.getCreditorName();

		// 현재까지 납부한 총액 (모든 송금 금액 합)
		long repaymentAmount = transfers.stream()
			.filter(t -> t.getCurrentRound() != 0)
			.mapToLong(TransferEntity::getAmount)
			.sum();

		// 중도상환 상태인 송금 중, 수수료 대상인(paymentDifference > 0) 건들의 총 수수료
		long totalEarlyRepaymentCharge = schedules.stream()
			.mapToLong(PaymentScheduleEntity::getEarlyRepaymentFee)
			.sum();

		// 총 납부해야하는 금액
		long requiredPay = schedules.stream()
			.mapToLong(s -> s.getScheduledPrincipal()
				+ s.getScheduledInterest()
				+ s.getOverdueAmount()
				+ s.getEarlyRepaymentFee())
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
			.remainingPrincipal(requiredPay - repaymentAmount)
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

		long totalPrincipal = 0L;
		long totalInterest = 0L;
		long totalOverdueInterest = 0L;

		long totalRequiredPay = 0L;
		long totalPay = 0L;

		int currentPaymentRound = contract.getCurrentPaymentRound();

		for (PaymentScheduleEntity schedule : schedules) {
			long scheduledPrincipal = schedule.getScheduledPrincipal();
			long scheduledInterest = schedule.getScheduledInterest();
			long overdueAmount = schedule.getOverdueAmount();
			long paid = schedule.getActualPaidAmount() != null ? schedule.getActualPaidAmount() : 0L;
			long earlyRepaymentFee = schedule.getEarlyRepaymentFee();

			if (schedule.getPaymentRound() <= currentPaymentRound) {
				totalRequiredPay += scheduledPrincipal + scheduledInterest + overdueAmount + earlyRepaymentFee;
				totalPay += paid;
			}
			// 전체 원금, 이자 총합 (만기 기준)
			totalPrincipal += scheduledPrincipal;
			totalInterest += scheduledInterest;
			totalEarlyRepaymentFee += earlyRepaymentFee;
			totalOverdueInterest += overdueAmount;

			if (Boolean.TRUE.equals(schedule.getIsPaid())) {
				paidPrincipal += scheduledPrincipal;
				paidInterest += scheduledInterest;
				paidOverdueInterest += overdueAmount;
			} else { // paid가 안되었다면
				if (paid > 0) {
					if (Boolean.TRUE.equals(schedule.getIsOverdue())) {
						long currentPaid = paid - overdueAmount;
						if (currentPaid >= 0) {
							long currentPaidPrincipal = currentPaid - scheduledInterest;
							if (currentPaidPrincipal >= 0) {
								paidOverdueInterest += overdueAmount;
								paidInterest += scheduledInterest;
								paidPrincipal += currentPaidPrincipal;
							} else {
								paidOverdueInterest += overdueAmount;
								paidInterest += currentPaid;
							}
						} else {
							paidOverdueInterest += overdueAmount;
						}

					} else {
						long currentPaidPrincipal = paid - scheduledInterest; // 실제 낸 돈에서 이자를 뺀 돈 즉 원금에서 깎일 돈
						if (currentPaidPrincipal >= 0) { // 그니까 원금에서 깎일 돈이 0 이상이면
							paidPrincipal += currentPaidPrincipal;
							paidInterest += scheduledInterest;
						} else {
							paidInterest += paid;
						}
					}
				}
			}
		}

		return InterestResponse.builder()
			.paidPrincipalAmount(paidPrincipal)
			.paidInterestAmount(paidInterest)
			.paidOverdueInterestAmount(paidOverdueInterest)
			.totalEarlyRepaymentFee(totalEarlyRepaymentFee)
			.unpaidAmount(Math.max(0, totalRequiredPay - totalPay))
			.expectedPaymentAmountAtMaturity(
				totalPrincipal + totalInterest + totalEarlyRepaymentFee + totalOverdueInterest)
			.expectedPrincipalAmountAtMaturity(totalPrincipal)
			.expectedInterestAmountAtMaturity(totalInterest + totalOverdueInterest)
			.build();
	}

	/**
	 * 특정 사용자와 상대방 간의 계약을 반환 (채무자 계약만)
	 */
	@Transactional
	public List<ContractWithPartnerResponse> selectContractWithPartner(Integer userId, Integer partnerId) {
		List<FormEntity> debtorForms = formRepository.findUserIsDebtorSideForms(
			userId, partnerId, PageRequest.of(0, 1000)).getContent();

		List<ContractWithPartnerResponse> responses = new ArrayList<>();

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
	public List<ContractPreviewResponse> selectAllContractByStatus(List<FormStatus> statuses, Integer userId) {
		UserEntity user = getUser(userId);
		List<FormEntity> allForms = formRepository.findAllByStatuses(userId, statuses);
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
							long total = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount()
								+ s.getEarlyRepaymentFee();
							long paid = s.getActualPaidAmount() != null ? s.getActualPaidAmount() : 0L;
							return Math.max(0, total - paid);
						})
						.sum();

					// 진행 중, 연체만 납부할 회차 추출
					if (form.getStatus() == FormStatus.IN_PROGRESS || form.getStatus() == FormStatus.OVERDUE) {
						nextAmount = calculateCurrentRepaymentAmount(contract, schedules);
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

				// 💰 실제 납부 금액이 존재하면 납부 금액으로 누적
				if (actual > 0) {
					if (isCreditor)
						received += actual;
					else
						paid += actual;
				}

				// 🔜 아직 미납된 금액도 누적
				if (Boolean.FALSE.equals(s.getIsPaid())) {
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

	private long calculateCurrentRepaymentAmount(ContractEntity contract, List<PaymentScheduleEntity> schedules) {
		Integer currentRound = contract.getCurrentPaymentRound();
		long currentRepaymentAmount = 0L;

		for (PaymentScheduleEntity schedule : schedules) {
			if (schedule.getPaymentRound() > currentRound) {
				continue;
			}

			if (Boolean.TRUE.equals(schedule.getIsPaid())) {
				continue;
			}

			long principal = schedule.getScheduledPrincipal();
			long interest = schedule.getScheduledInterest();
			long overdueAmount = schedule.getOverdueAmount();
			long paid = schedule.getActualPaidAmount();

			long total = Math.max(0, principal + interest + overdueAmount - paid);

			currentRepaymentAmount += total;
		}
		return currentRepaymentAmount;
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
		TransferStatus transferStatus = null;

		if (status.equals("연체")) {
			transferStatus = TransferStatus.OVERDUE;
		} else if (status.equals("납부")) {
			transferStatus = TransferStatus.PAID;
		} else if (status.equals("중도상환")) {
			transferStatus = TransferStatus.EARLY_REPAYMENT;
		}

		Page<TransferEntity> transfers = transferRepository.findByFormAndStatusAndCurrentRoundGreaterThan(form,
			transferStatus, 0, pageable);

		return transfers.map(TransferFormListResponse::fromEntity);
	}

	@Transactional
	public void notifyRepaymentDueContracts() {
		List<FormEntity> forms = formRepository.findByStatusIn(List.of(FormStatus.IN_PROGRESS, FormStatus.OVERDUE));

		for (FormEntity form : forms) {
			ContractEntity contract = contractRepository.findByForm(form).orElse(null);
			if (contract == null) {
				continue;
			}

			int currentRound = contract.getCurrentPaymentRound();
			Optional<PaymentScheduleEntity> optSchedule = paymentScheduleService
				.selectByContractAndRound(contract, currentRound);

			if (optSchedule.isEmpty()) {
				continue;
			}
			PaymentScheduleEntity schedule = optSchedule.get();

			if (!Boolean.TRUE.equals(schedule.getIsPaid())
				&& schedule.getScheduledPaymentDate().toLocalDate().isEqual(LocalDate.now())) {

				long scheduledTotal = schedule.getScheduledPrincipal() + schedule.getScheduledInterest();
				long actualPaid = schedule.getActualPaidAmount() != null ? schedule.getActualPaidAmount() : 0L;
				long amount = Math.max(0, scheduledTotal - actualPaid);

				String senderName = form.getDebtorName();
				String receiverName = form.getCreditorName();
				String formattedAmount = NumberFormat.getNumberInstance().format(amount);

				// 채무자 알림
				alertService.createAlert(
					form.getDebtor(),
					"상환일",
					"오늘은 상환일입니다!",
					receiverName + "님께 " + formattedAmount + "원을 상환하세요"
				);

				// 채권자 알림
				alertService.createAlert(
					form.getCreditor(),
					"상환일",
					"오늘은 상환일입니다!",
					senderName + "님께서 " + formattedAmount + "원을 상환할 예정입니다"
				);
			}
		}
	}

	/* TODO
	 * 1. contract 의 회차, 다음 상환일 갱신시켜주는 스케줄러 updateContractsNextRepayment
	 * 2. contract 의 연체 판단하는 스케줄러(연체처리, 알림 발송)
	 * 3. 연체중인 놈 가져와서 연체 이자 누적시켜버리는 스케줄러
	 */

	@Transactional
	public void updateContractsNextRepayment() {
		LocalDate today = LocalDate.now();
		List<FormEntity> forms = formRepository.findByStatusIn(List.of(FormStatus.IN_PROGRESS, FormStatus.OVERDUE));

		for (FormEntity form : forms) {
			ContractEntity contract = contractRepository.findByForm(form).orElse(null);
			if (contract == null) {
				continue;
			}

			boolean updated = false;

			LocalDate nextRepaymentDate = contract.getNextRepaymentDate();
			if (nextRepaymentDate == null || !nextRepaymentDate.plusDays(1).isEqual(today))
				continue;

			int currentRound = contract.getCurrentPaymentRound();
			PaymentScheduleEntity currentSchedule =
				paymentScheduleService.selectByContractAndRound(contract, currentRound).orElse(null);

			// ✅ 현재 회차가 아직 납부되지 않았다면 → 연체 처리
			if (currentSchedule != null && Boolean.FALSE.equals(currentSchedule.getIsPaid())) {
				currentSchedule.markAsOverdue();
				form.updateStatus(FormStatus.OVERDUE);
				contract.updateOverdue();

				// ✅ 납부해야 할 전체 금액 계산 (예상 납부 금액 로직 재활용)
				ExpectedPaymentAmountResponse expected = selectExpectedPaymentAmount(form.getId());
				long notPaid = expected.getMonthlyRemainingPayment();
				String formattedAmount = NumberFormat.getNumberInstance().format(notPaid);

				alertService.createAlert(
					form.getDebtor(),
					"연체",
					"연체가 발생했습니다!",
					form.getCreditorName() + "님께 " + formattedAmount + "원을 이체해주세요."
				);

				alertService.createAlert(
					form.getCreditor(),
					"연체",
					"연체가 발생했습니다!",
					form.getDebtorName() + "님께서 아직 " + formattedAmount + "원을 송금하지 않았어요."
				);

				paymentScheduleRepository.save(currentSchedule);
				formRepository.save(form);
				updated = true;
			}

			PaymentScheduleEntity nextSchedule = paymentScheduleService.selectByContractAndRound(contract,
				contract.getCurrentPaymentRound() + 1).orElse(null);

			if (nextSchedule != null) {
				contract.updateSchedule(nextSchedule.getPaymentRound(),
					nextSchedule.getScheduledPaymentDate().toLocalDate());
				updated = true;
			}

			if (updated) {
				contractRepository.save(contract);
			}
		}
	}

	@Transactional
	public void accumulateOverdueInterestDaily() {
		List<FormEntity> overdueForms = formRepository.findByStatus(FormStatus.OVERDUE);

		for (FormEntity form : overdueForms) {
			ContractEntity contract = contractRepository.findByForm(form).orElse(null);
			if (contract == null)
				continue;

			List<PaymentScheduleEntity> overdueSchedules = paymentScheduleService
				.selectOverdueUnpaidSchedules(contract); // isOverdue = true && isPaid = false

			BigDecimal interestRate = form.getInterestRate();
			BigDecimal overdueRate = form.getOverdueInterestRate();

			if (interestRate == null)
				interestRate = BigDecimal.ZERO;
			if (overdueRate == null)
				overdueRate = BigDecimal.ZERO;

			BigDecimal totalRate = interestRate.add(overdueRate); // 연체 이자율 + 일반 이자율
			BigDecimal dailyRate = totalRate
				.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP) // 퍼센트 처리
				.divide(BigDecimal.valueOf(365), 10, RoundingMode.HALF_UP); // 하루치 이율

			long totalAccumulated = 0L;
			long totalOverdueAmount = 0L;

			for (PaymentScheduleEntity schedule : overdueSchedules) {
				long principal = schedule.getScheduledPrincipal();
				long interestOriginal = schedule.getScheduledInterest();
				long paid = schedule.getActualPaidAmount() != null ? schedule.getActualPaidAmount() : 0L;

				long unpaidPrincipal = Math.max(0, principal - paid);

				long interest = BigDecimal.valueOf(unpaidPrincipal)
					.multiply(dailyRate)
					.setScale(0, RoundingMode.HALF_UP)
					.longValue();

				schedule.accumulateOverdue(interest);
				totalAccumulated += interest;

				long scheduledTotal = principal + interestOriginal + schedule.getOverdueAmount();
				totalOverdueAmount += Math.max(0, scheduledTotal - paid);
			}

			contract.addOverdueInterest(totalAccumulated);
			contract.setOverdueAmount(totalOverdueAmount);

			paymentScheduleRepository.saveAll(overdueSchedules);
			contractRepository.save(contract);
		}
	}

}