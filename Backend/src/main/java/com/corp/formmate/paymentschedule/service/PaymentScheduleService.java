package com.corp.formmate.paymentschedule.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.PaymentScheduleException;
import com.corp.formmate.paymentschedule.entity.PaymentScheduleEntity;
import com.corp.formmate.paymentschedule.repository.PaymentScheduleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class PaymentScheduleService {

	private final PaymentScheduleRepository paymentScheduleRepository;

	@Transactional
	public void createSchedules(FormEntity form, ContractEntity contract, PaymentPreviewResponse preview) {
		List<PaymentScheduleEntity> schedules = preview.getSchedulePage().getContent().stream()
			.map(s -> PaymentScheduleEntity.builder()
				.contract(contract)
				.paymentRound(s.getInstallmentNumber())
				.scheduledPaymentDate(s.getPaymentDate())
				.scheduledPrincipal(s.getPrincipal())
				.scheduledInterest(s.getInterest())
				.overdueAmount(0L)
				.earlyRepaymentFee(0L)
				.actualPaidAmount(0L)
				.actualPaidDate(null)
				.isPaid(false)
				.isOverdue(false)
				.build()
			).toList();

		log.info("5-7. 스케줄 저장 직전");

		paymentScheduleRepository.saveAll(schedules);
	}

	@Transactional(readOnly = true)
	public List<PaymentScheduleEntity> selectByContract(ContractEntity contractEntity) {
		List<PaymentScheduleEntity> schedules = paymentScheduleRepository.findByContract(contractEntity);
		if (schedules == null || schedules.isEmpty()) {
			throw new PaymentScheduleException(ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND);
		}
		return schedules;
	}

	@Transactional(readOnly = true)
	public List<PaymentScheduleEntity> selectCurrentPaymentSchedule(ContractEntity contractEntity) {
		Integer currentRound = contractEntity.getCurrentPaymentRound();
		return paymentScheduleRepository.findByContractAndPaymentRoundLessThanEqualAndIsPaidFalse(contractEntity,
			currentRound);
	}

	@Transactional(readOnly = true)
	public PaymentScheduleEntity selectNextScheduleByContract(ContractEntity contractEntity) {
		return paymentScheduleRepository.findFirstByContractAndIsPaidOrderByPaymentRoundAsc(contractEntity, false)
			.orElseThrow(() -> new PaymentScheduleException(ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND));
	}

	@Transactional(readOnly = true)
	public PaymentScheduleEntity selectById(Integer id) {
		PaymentScheduleEntity schedule = paymentScheduleRepository.findById(id)
			.orElseThrow(() -> new PaymentScheduleException(
				ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND));
		return schedule;
	}

	@Transactional(readOnly = true)
	public List<PaymentScheduleEntity> selectByContractOrderByPaymentRoundAsc(ContractEntity contract) {
		return paymentScheduleRepository.findByContractOrderByPaymentRoundAsc(contract);
	}

	@Transactional
	public List<PaymentScheduleEntity> updateSchedulesForRepaymentAndReturnUpdated(ContractEntity contract,
		FormEntity form, long leftover) {
		List<PaymentScheduleEntity> schedules = selectByContractOrderByPaymentRoundAsc(contract);
		LocalDateTime now = LocalDateTime.now();
		boolean isFirst = true;

		for (PaymentScheduleEntity s : schedules) {
			if (Boolean.TRUE.equals(s.getIsPaid()))
				continue;

			long scheduledTotal = s.getScheduledPrincipal() + s.getScheduledInterest() + s.getOverdueAmount();

			if (isFirst) {
				isFirst = false;
				if (leftover >= scheduledTotal) {
					s.markAsPaid(scheduledTotal, now);
					leftover -= scheduledTotal;

					// 수수료 부과
					if (leftover > 0 && form.getEarlyRepaymentFeeRate() != null) {
						BigDecimal feeRate = form.getEarlyRepaymentFeeRate();
						BigDecimal leftoverDecimal = BigDecimal.valueOf(leftover);
						long fee = leftoverDecimal.multiply(feeRate).longValue();

						s.applyEarlyRepaymentFee(fee);
						leftover -= fee;
						contract.addToTotalEarlyRepaymentFee(fee);
					}
				} else {
					s.markAsPartialPaid(leftover, now);
					contract.setRemainingPrincipal(
						contract.getRemainingPrincipal() - Math.min(leftover, s.getScheduledPrincipal()));
					paymentScheduleRepository.saveAll(schedules);
					return schedules;
				}
			} else {
				long principal = s.getScheduledPrincipal();
				if (leftover >= principal) {
					s.applyEarlyRepayment();
					leftover -= principal;
					contract.setRemainingPrincipal(contract.getRemainingPrincipal() - principal);
				} else {
					// 일부만 소진 가능한 회차 → 납부 처리 + 이후 회차 재계산
					s.markAsPartialPaid(leftover, now);
					contract.setRemainingPrincipal(contract.getRemainingPrincipal() - leftover);
					leftover = 0;
					break;
				}
			}
		}

		// 남은 회차 재계산 (회차/납부일 고정)
		List<PaymentScheduleEntity> remaining = schedules.stream()
			.filter(s -> !Boolean.TRUE.equals(s.getIsPaid()))
			.toList();

		long remainingPrincipal = contract.getRemainingPrincipal();
		long equalPrincipal = remainingPrincipal / Math.max(1, remaining.size());

		for (PaymentScheduleEntity s : remaining) {
			long interest = estimateInterest(equalPrincipal, contract);
			s.updateSchedule(equalPrincipal, interest);
		}

		paymentScheduleRepository.saveAll(schedules);
		return schedules;
	}

	private long estimateInterest(long principal, ContractEntity contract) {
		BigDecimal rate = contract.getForm().getInterestRate();
		if (rate == null || rate.compareTo(BigDecimal.ZERO) == 0)
			return 0L;
		BigDecimal interest = BigDecimal.valueOf(principal)
			.multiply(rate)
			.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP);
		return interest.longValue();
	}

}

