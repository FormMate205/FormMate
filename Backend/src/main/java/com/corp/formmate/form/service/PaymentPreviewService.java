package com.corp.formmate.form.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.dto.PaymentScheduleResponse;
import com.corp.formmate.form.entity.RepaymentMethod;

@Service
public class PaymentPreviewService {

	private static final int MONTHS_IN_YEAR = 12;

	/**
	 * 예상 납부 스케줄을 계산합니다.
	 *
	 * @param paymentPreviewRequest 납부 스케줄 계산 요청 정보
	 * @param pageable 페이지네이션 정보
	 * @return 예상 납부 스케줄 응답
	 */
	public PaymentPreviewResponse calculatePaymentPreview(PaymentPreviewRequest paymentPreviewRequest,
		Pageable pageable) {
		// 요청 유효성 검증
		paymentPreviewRequest.validate();

		// 상환 방법에 따라 납부 스케줄 계산
		List<PaymentScheduleResponse> allSchedules;

		switch (RepaymentMethod.fromKorName(paymentPreviewRequest.getRepaymentMethod())) {
			case EQUAL_PRINCIPAL:
				allSchedules = calculateEqualPrincipal(paymentPreviewRequest);
				break;
			case EQUAL_PRINCIPAL_INTEREST:
				allSchedules = calculateEqualPrincipalInterest(paymentPreviewRequest);
				break;
			case PRINCIPAL_ONLY:
				allSchedules = calculatePrincipalOnly(paymentPreviewRequest);
				break;
			default:
				throw new IllegalArgumentException("지원하지 않는 상환 방법입니다: " + paymentPreviewRequest.getRepaymentMethod());
		}

		// 총 상환금액 계산
		Long totalRepaymentAmount = allSchedules.stream()
			.mapToLong(PaymentScheduleResponse::getPaymentAmount)
			.sum();

		// 페이지네이션 적용
		int totalInstallments = allSchedules.size();
		int start = (int)pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), allSchedules.size());

		List<PaymentScheduleResponse> pageContent =
			start < totalInstallments ? allSchedules.subList(start, end) : new ArrayList<>();

		Page<PaymentScheduleResponse> schedulePage = new PageImpl<>(
			pageContent, pageable, totalInstallments);

		// 응답 구성
		return PaymentPreviewResponse.builder()
			.totalRepaymentAmount(totalRepaymentAmount)
			.totalInstallments(totalInstallments)
			.schedulePage(schedulePage)
			.build();
	}

	/**
	 * 원금균등상환 방식의 납부 스케줄을 계산합니다.
	 * 매월 동일한 원금을 상환하고, 이자는 남은 원금에 대해 계산됩니다.
	 */
	private List<PaymentScheduleResponse> calculateEqualPrincipal(PaymentPreviewRequest paymentPreviewRequest) {
		List<PaymentScheduleResponse> schedules = new ArrayList<>();

		// 기본 정보 설정
		Long loanAmount = paymentPreviewRequest.getLoanAmount();
		BigDecimal interestRateDecimal = paymentPreviewRequest.getInterestRateAsBigDecimal()
			.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
			.divide(BigDecimal.valueOf(MONTHS_IN_YEAR), 10, RoundingMode.HALF_UP);

		// 총 납부 개월 수 계산
		int totalMonths = calculateTotalMonths(paymentPreviewRequest);

		// 월별 상환 원금 (고정)
		Long monthlyPrincipal = loanAmount / totalMonths;

		// 남은 원금 (매월 감소)
		Long remainingPrincipal = loanAmount;

		// 각 납부회차별 계산
		for (int i = 0; i < totalMonths; i++) {
			// 회차별 이자 계산 (남은 원금 * 월 이자율)
			Long interest = Math.round(remainingPrincipal * interestRateDecimal.doubleValue());

			// 회차별 납부금액 (원금 + 이자)
			Long paymentAmount = monthlyPrincipal + interest;

			// 납부일 계산
			LocalDateTime paymentDate = calculatePaymentDate(paymentPreviewRequest, i + 1);

			// 마지막 회차는 원금 계산 오차 보정
			if (i == totalMonths - 1) {
				monthlyPrincipal = remainingPrincipal;
				paymentAmount = monthlyPrincipal + interest;
			}

			// 납부 스케줄 항목 생성
			PaymentScheduleResponse schedule = PaymentScheduleResponse.builder()
				.installmentNumber(i + 1)
				.paymentDate(paymentDate)
				.principal(monthlyPrincipal)
				.interest(interest)
				.paymentAmount(paymentAmount)
				.build();

			schedules.add(schedule);

			// 남은 원금 갱신
			remainingPrincipal -= monthlyPrincipal;
		}

		return schedules;
	}

	/**
	 * 원리금균등상환 방식의 납부 스케줄을 계산합니다.
	 * 매월 동일한 금액(원금+이자)을 상환하고, 초기에는 이자 비중이 크고 후기에는 원금 비중이 커집니다.
	 * PMT 공식 사용: 월납입금 = 원금 * 월이자율 * (1 + 월이자율)^총개월 / ((1 + 월이자율)^총개월 - 1)
	 */
	private List<PaymentScheduleResponse> calculateEqualPrincipalInterest(PaymentPreviewRequest request) {
		List<PaymentScheduleResponse> schedules = new ArrayList<>();

		// 기본 정보 설정
		Long loanAmount = request.getLoanAmount();
		BigDecimal interestRateDecimal = request.getInterestRateAsBigDecimal()
			.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
			.divide(BigDecimal.valueOf(MONTHS_IN_YEAR), 10, RoundingMode.HALF_UP);

		// 총 납부 개월 수 계산
		int totalMonths = calculateTotalMonths(request);

		// 월 상환금액 계산 (PMT 공식)
		Long monthlyPayment;

		// 이자율이 0인 경우 처리
		if (interestRateDecimal.compareTo(BigDecimal.ZERO) == 0) {
			monthlyPayment = loanAmount / totalMonths;
		} else {
			// (1 + 월이자율)^총개월 계산
			BigDecimal compoundFactor = BigDecimal.ONE.add(interestRateDecimal)
				.pow(totalMonths, MathContext.DECIMAL128);

			// 월납입금 = 원금 * 월이자율 * (1 + 월이자율)^총개월 / ((1 + 월이자율)^총개월 - 1)
			BigDecimal numerator = interestRateDecimal.multiply(compoundFactor);
			BigDecimal denominator = compoundFactor.subtract(BigDecimal.ONE);

			BigDecimal loanAmountDecimal = new BigDecimal(loanAmount);
			BigDecimal paymentDecimal = loanAmountDecimal.multiply(numerator)
				.divide(denominator, 0, RoundingMode.HALF_UP);

			monthlyPayment = paymentDecimal.longValue();
		}

		// 남은 원금 (매월 감소)
		Long remainingPrincipal = loanAmount;

		// 각 납부회차별 계산
		for (int i = 0; i < totalMonths; i++) {
			// 회차별 이자 계산 (남은 원금 * 월 이자율)
			Long interest = Math.round(remainingPrincipal * interestRateDecimal.doubleValue());

			// 회차별 원금 상환액 계산 (월 상환금액 - 이자)
			Long principal = monthlyPayment - interest;

			// 마지막 회차는 남은 원금 정확히 상환 (계산 오차 보정)
			if (i == totalMonths - 1 || principal > remainingPrincipal) {
				principal = remainingPrincipal;
				monthlyPayment = principal + interest;
			}

			// 납부일 계산
			LocalDateTime paymentDate = calculatePaymentDate(request, i + 1);

			// 납부 스케줄 항목 생성
			PaymentScheduleResponse schedule = PaymentScheduleResponse.builder()
				.installmentNumber(i + 1)
				.paymentDate(paymentDate)
				.principal(principal)
				.interest(interest)
				.paymentAmount(monthlyPayment)
				.build();

			schedules.add(schedule);

			// 남은 원금 갱신
			remainingPrincipal -= principal;
		}

		return schedules;
	}

	/**
	 * 원금상환 방식의 납부 스케줄을 계산합니다.
	 * 만기일에 원금을 일시 상환하고, 매월 이자만 납부합니다.
	 */
	private List<PaymentScheduleResponse> calculatePrincipalOnly(PaymentPreviewRequest request) {
		List<PaymentScheduleResponse> schedules = new ArrayList<>();

		// 기본 정보 설정
		Long loanAmount = request.getLoanAmount();
		BigDecimal interestRateDecimal = request.getInterestRateAsBigDecimal()
			.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
			.divide(BigDecimal.valueOf(MONTHS_IN_YEAR), 10, RoundingMode.HALF_UP);

		// 총 납부 개월 수 계산
		int totalMonths = calculateTotalMonths(request);

		// 매월 이자 계산 (고정)
		Long monthlyInterest = Math.round(loanAmount * interestRateDecimal.doubleValue());

		// 각 납부회차별 계산
		for (int i = 0; i < totalMonths; i++) {
			// 마지막 회차에만 원금 상환
			Long principal = (i == totalMonths - 1) ? loanAmount : 0L;

			// 회차별 납부금액 (원금 + 이자)
			Long paymentAmount = principal + monthlyInterest;

			// 납부일 계산
			LocalDateTime paymentDate = calculatePaymentDate(request, i + 1);

			// 납부 스케줄 항목 생성
			PaymentScheduleResponse schedule = PaymentScheduleResponse.builder()
				.installmentNumber(i + 1)
				.paymentDate(paymentDate)
				.principal(principal)
				.interest(monthlyInterest)
				.paymentAmount(paymentAmount)
				.build();

			schedules.add(schedule);
		}

		return schedules;
	}

	/**
	 * 총 납부 개월 수를 계산합니다.
	 * 현재 날짜부터 만기일까지의 개월 수를 계산합니다.
	 */
	private int calculateTotalMonths(PaymentPreviewRequest request) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime maturityDate = request.getMaturityDate();

		// 상환일이 0이면 분할납부가 없으므로 만기일에 일시 상환
		if (request.getRepaymentDay() == 0) {
			return 1;
		}

		// 개월 수 계산
		long months = ChronoUnit.MONTHS.between(now.withDayOfMonth(1), maturityDate.withDayOfMonth(1));

		// 최소 1개월 이상
		return Math.max(1, (int)months);
	}

	/**
	 * 납부회차에 해당하는 납부일을 계산합니다.
	 */
	private LocalDateTime calculatePaymentDate(PaymentPreviewRequest request, int installmentNumber) {
		LocalDateTime now = LocalDateTime.now();

		// 상환일이 0이면 만기일에 일시 상환
		if (request.getRepaymentDay() == 0) {
			return request.getMaturityDate();
		}

		// 상환일 설정
		int day = Math.min(request.getRepaymentDay(), getLastDayOfMonth(now.plusMonths(installmentNumber)));

		return now.plusMonths(installmentNumber)
			.withDayOfMonth(day)
			.withHour(0)
			.withMinute(0)
			.withSecond(0)
			.withNano(0);
	}

	/**
	 * 해당 월의 마지막 날짜를 반환합니다.
	 */
	private int getLastDayOfMonth(LocalDateTime date) {
		return date.toLocalDate().lengthOfMonth();
	}
}