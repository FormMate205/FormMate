package com.corp.formmate.form.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.form.dto.EnhancedPaymentPreviewResponse;
import com.corp.formmate.form.dto.EnhancedPaymentScheduleResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnhancedPaymentPreviewService {

	/**
	 * 진행 중(IN_PROGRESS) 또는 연체(OVERDUE)가 아닌 상태면 스케줄 없이 빈 목록.
	 * IN_PROGRESS면 form.getInterestRate() 사용,
	 * OVERDUE면 (기본이자율 + 연체이자율) 사용.
	 */
	public EnhancedPaymentPreviewResponse calculateEnhancedPaymentPreview(FormEntity form, ContractEntity contract) {
		// 상태가 IN_PROGRESS, OVERDUE 외엔 스케줄 없음
		if (form.getStatus() != FormStatus.IN_PROGRESS && form.getStatus() != FormStatus.OVERDUE) {
			return EnhancedPaymentPreviewResponse.builder()
				.totalInstallments(0)
				.totalRepaymentAmount(0L)
				.scheduleList(new ArrayList<>())
				.build();
		}

		// 진행 중 → 기본금리, 연체 → (기본 + 연체)
		BigDecimal baseRate;
		if (form.getStatus() == FormStatus.OVERDUE) {
			baseRate = form.getInterestRate().add(form.getOverdueInterestRate());
		} else {
			baseRate = form.getInterestRate();
		}

		switch (form.getRepaymentMethod()) {
			case EQUAL_PRINCIPAL:
				return calculateEnhancedEqualPrincipal(form, contract, baseRate);
			case EQUAL_PRINCIPAL_INTEREST:
				return calculateEnhancedEqualPrincipalInterest(form, contract, baseRate);
			case PRINCIPAL_ONLY:
				return calculateEnhancedPrincipalOnly(form, contract, baseRate);
			default:
				throw new ContractException(ErrorCode.INVALID_INPUT_VALUE);
		}
	}

	/**
	 * [원금균등상환] - 매달 동일한 원금 + 남은원금 대비 이자
	 */
	private EnhancedPaymentPreviewResponse calculateEnhancedEqualPrincipal(
		FormEntity form, ContractEntity contract, BigDecimal baseRate) {

		List<EnhancedPaymentScheduleResponse> schedules = new ArrayList<>();
		int totalMonths = calculateTotalMonths(form.getRepaymentDay(), form.getMaturityDate());

		long monthlyPrincipal = form.getLoanAmount() / totalMonths;
		long remainingPrincipal = contract.getRemainingPrincipal();

		// 월 이자율 = baseRate / 1200 (ex. 12% → 0.12 / 12)
		BigDecimal monthlyRate = baseRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);

		for (int i = 0; i < totalMonths; i++) {
			int round = i + 1;

			// 마지막 회차에서 잔여 원금 전부 상환
			long principal = (i == totalMonths - 1) ? remainingPrincipal : monthlyPrincipal;

			// 남은 원금에 대한 월 이자
			long interest = BigDecimal.valueOf(remainingPrincipal)
				.multiply(monthlyRate)
				.longValue();

			// 중도상환 수수료
			long earlyFee = (contract.getTotalEarlyRepaymentFee() > 0
				&& round == contract.getCurrentPaymentRound())
				? BigDecimal.valueOf(contract.getTotalEarlyRepaymentFee())
				.multiply(form.getEarlyRepaymentFeeRate())
				.longValue()
				: 0L;

			// overdueInterest 계산은 제거 (이미 baseRate에 연체이자 포함했으므로)
			long overdueInterest = 0L;

			long paymentAmount = principal + interest + earlyFee;

			schedules.add(
				EnhancedPaymentScheduleResponse.builder()
					.installmentNumber(round)
					.paymentDate(calculatePaymentDate(form.getRepaymentDay(), form.getMaturityDate(), round))
					.principal(principal)
					.interest(interest)
					.overdueInterest(overdueInterest)
					.earlyRepaymentFee(earlyFee)
					.paymentAmount(paymentAmount)
					.isCurrentRound(round == contract.getCurrentPaymentRound())
					.build()
			);

			remainingPrincipal -= principal;
		}

		long totalRepayment = schedules.stream()
			.mapToLong(EnhancedPaymentScheduleResponse::getPaymentAmount)
			.sum();

		return EnhancedPaymentPreviewResponse.builder()
			.totalInstallments(schedules.size())
			.totalRepaymentAmount(totalRepayment)
			.scheduleList(schedules)
			.build();
	}

	/**
	 * [원리금균등상환] - 매달 동일한 금액(원금+이자), 초기에 이자 비중이 크고 나중에 원금 비중↑
	 */
	private EnhancedPaymentPreviewResponse calculateEnhancedEqualPrincipalInterest(
		FormEntity form, ContractEntity contract, BigDecimal baseRate) {

		List<EnhancedPaymentScheduleResponse> schedules = new ArrayList<>();
		int totalMonths = calculateTotalMonths(form.getRepaymentDay(), form.getMaturityDate());

		// 월 이자율
		BigDecimal monthlyRate = baseRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);

		// PMT 공식 (일반 금융 공학)
		long monthlyPayment;
		if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
			// 이자율이 0이면 그냥 원금 / 회차
			monthlyPayment = form.getLoanAmount() / totalMonths;
		} else {
			BigDecimal factor = BigDecimal.ONE.add(monthlyRate).pow(totalMonths);
			monthlyPayment = BigDecimal.valueOf(form.getLoanAmount())
				.multiply(monthlyRate)
				.multiply(factor)
				.divide(factor.subtract(BigDecimal.ONE), 0, RoundingMode.HALF_UP)
				.longValue();
		}

		long remainingPrincipal = contract.getRemainingPrincipal();

		for (int i = 0; i < totalMonths; i++) {
			int round = i + 1;

			// 이번 달 이자
			long interest = BigDecimal.valueOf(remainingPrincipal)
				.multiply(monthlyRate)
				.longValue();
			// 원금 = 월 납입액 - 이자
			long principal = monthlyPayment - interest;

			// 마지막 회차 정산
			if (i == totalMonths - 1 || principal > remainingPrincipal) {
				principal = remainingPrincipal;
				monthlyPayment = principal + interest;
			}

			long earlyFee = (contract.getTotalEarlyRepaymentFee() > 0
				&& round == contract.getCurrentPaymentRound())
				? BigDecimal.valueOf(contract.getTotalEarlyRepaymentFee())
				.multiply(form.getEarlyRepaymentFeeRate())
				.longValue()
				: 0L;

			long overdueInterest = 0L; // 제거

			long paymentAmount = principal + interest + earlyFee;

			schedules.add(
				EnhancedPaymentScheduleResponse.builder()
					.installmentNumber(round)
					.paymentDate(calculatePaymentDate(form.getRepaymentDay(), form.getMaturityDate(), round))
					.principal(principal)
					.interest(interest)
					.overdueInterest(overdueInterest)
					.earlyRepaymentFee(earlyFee)
					.paymentAmount(paymentAmount)
					.isCurrentRound(round == contract.getCurrentPaymentRound())
					.build()
			);

			remainingPrincipal -= principal;
		}

		long totalRepayment = schedules.stream()
			.mapToLong(EnhancedPaymentScheduleResponse::getPaymentAmount)
			.sum();

		return EnhancedPaymentPreviewResponse.builder()
			.totalInstallments(schedules.size())
			.totalRepaymentAmount(totalRepayment)
			.scheduleList(schedules)
			.build();
	}

	/**
	 * [원금상환(만기일시상환)] - 매월 이자만 내고, 마지막에 원금 일시 상환
	 */
	private EnhancedPaymentPreviewResponse calculateEnhancedPrincipalOnly(
		FormEntity form, ContractEntity contract, BigDecimal baseRate) {

		List<EnhancedPaymentScheduleResponse> schedules = new ArrayList<>();
		int totalMonths = calculateTotalMonths(form.getRepaymentDay(), form.getMaturityDate());

		BigDecimal monthlyRate = baseRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
		long monthlyInterest = BigDecimal.valueOf(form.getLoanAmount())
			.multiply(monthlyRate)
			.longValue();

		for (int i = 0; i < totalMonths; i++) {
			int round = i + 1;

			// 마지막 회차에 원금 전부 납부
			long principal = (i == totalMonths - 1) ? form.getLoanAmount() : 0L;

			long earlyFee = (contract.getTotalEarlyRepaymentFee() > 0
				&& round == contract.getCurrentPaymentRound())
				? BigDecimal.valueOf(contract.getTotalEarlyRepaymentFee())
				.multiply(form.getEarlyRepaymentFeeRate())
				.longValue()
				: 0L;

			long overdueInterest = 0L;

			// 매 회차 납부액 = (이자 + 원금(마지막만)) + 중도수수료
			long paymentAmount = principal + monthlyInterest + earlyFee;

			schedules.add(
				EnhancedPaymentScheduleResponse.builder()
					.installmentNumber(round)
					.paymentDate(calculatePaymentDate(form.getRepaymentDay(), form.getMaturityDate(), round))
					.principal(principal)
					.interest(monthlyInterest)
					.overdueInterest(overdueInterest)
					.earlyRepaymentFee(earlyFee)
					.paymentAmount(paymentAmount)
					.isCurrentRound(round == contract.getCurrentPaymentRound())
					.build()
			);
		}

		long totalRepayment = schedules.stream()
			.mapToLong(EnhancedPaymentScheduleResponse::getPaymentAmount)
			.sum();

		return EnhancedPaymentPreviewResponse.builder()
			.totalInstallments(schedules.size())
			.totalRepaymentAmount(totalRepayment)
			.scheduleList(schedules)
			.build();
	}

	/**
	 * [회차 수 계산]
	 * - repaymentDay=0 이면 일시상환으로 회차=1
	 * - 그 외면 현재일부터 만기일까지의 개월 수
	 */
	private int calculateTotalMonths(int repaymentDay, LocalDateTime maturityDate) {
		if (repaymentDay == 0) {
			return 1;
		}
		LocalDateTime now = LocalDateTime.now();
		long months = ChronoUnit.MONTHS.between(
			now.withDayOfMonth(1),
			maturityDate.withDayOfMonth(1)
		);
		return Math.max(1, (int)months);
	}

	/**
	 * [회차별 납부일 계산]
	 * - 실제 로직은 사업 요구사항에 맞춰 조정 가능
	 */
	private LocalDateTime calculatePaymentDate(int repaymentDay, LocalDateTime maturityDate, int installmentNumber) {
		if (repaymentDay == 0) {
			// 일시상환 - 그냥 만기일
			return maturityDate;
		}
		// 단순히 "현재일자 + installmentNumber개월" 형태로 예시
		LocalDateTime date = LocalDateTime.now().plusMonths(installmentNumber);
		int day = Math.min(repaymentDay, date.toLocalDate().lengthOfMonth());
		return date.withDayOfMonth(day).withHour(0).withMinute(0).withSecond(0).withNano(0);
	}

	public Long getCurrentRoundAmount(FormEntity form, ContractEntity contract) {
		int currentRound = contract.getCurrentPaymentRound();

		EnhancedPaymentPreviewResponse preview = calculateEnhancedPaymentPreview(form, contract);

		return preview.getScheduleList().stream()
			.filter(schedule -> schedule.getInstallmentNumber() == currentRound)
			.findFirst()
			.map(EnhancedPaymentScheduleResponse::getPaymentAmount)
			.orElse(0L);
	}

}
