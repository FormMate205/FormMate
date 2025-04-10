package com.corp.formmate.paymentschedule.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

	@Transactional(readOnly = true)
	public PaymentScheduleEntity selectNonPaidByContract(ContractEntity contractEntity) {
		log.info("selectNonPaidByContract 찾기");
		return paymentScheduleRepository.findFirstByContractAndIsPaidFalseOrderByPaymentRoundAsc(contractEntity)
			.orElseThrow(() -> new PaymentScheduleException(ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND));
	}

	@Transactional
	public List<PaymentScheduleEntity> updateSchedulesForRepaymentAndReturnUpdated(ContractEntity contract,
		FormEntity form, long leftover) {
		List<PaymentScheduleEntity> schedules = selectByContractOrderByPaymentRoundAsc(contract);
		Integer currentPaymentRound = contract.getCurrentPaymentRound();

		for (PaymentScheduleEntity s : schedules) {
			if (Boolean.TRUE.equals(s.getIsPaid())) {
				continue;
			}

			if(leftover <= 0) {
				break;
			}
			Integer paymentRound = s.getPaymentRound();
			long overdueAmount = s.getOverdueAmount();
			long interest = s.getScheduledInterest();
			long principal = s.getScheduledPrincipal();
			long paid = s.getActualPaidAmount();

			if(paymentRound <= currentPaymentRound) {
				long requiredPay = overdueAmount + interest + principal - paid;
				if(leftover >= requiredPay) {
					s.markAsPaid(requiredPay + paid, LocalDateTime.now());
				} else {
					s.markAsPartialPaid(leftover + paid, LocalDateTime.now());
				}
				leftover -= requiredPay;
			} else { // 중도상환
				long requiredPay = principal - paid;
				if(leftover >= requiredPay) {
					s.applyEarlyRepayment(requiredPay + paid, LocalDateTime.now());
				} else {
					s.markAsPartialPaid(leftover + paid, LocalDateTime.now());
				}
				leftover -= requiredPay;
			}
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

	@Transactional(readOnly = true)
	public Optional<PaymentScheduleEntity> selectByContractAndRound(ContractEntity contract, Integer round) {
		return paymentScheduleRepository.findByContractAndPaymentRound(contract, round);
	}

	@Transactional(readOnly = true)
	public List<PaymentScheduleEntity> selectOverdueUnpaidSchedules(ContractEntity contract) {
		return paymentScheduleRepository.findByContractAndIsPaidFalseAndIsOverdueTrue(contract);
	}

	// 중도상환으로 이 돈 입금 하면 계약 종료된다! 하는 메서드
	@Transactional(readOnly = true)
	public long calculateFinalRepaymentAmount(ContractEntity contract) {
		List<PaymentScheduleEntity> schedules = selectOverdueUnpaidSchedules(contract);
		long amounts = 0L;
		int currentPaymentRound = contract.getCurrentPaymentRound();
		for (PaymentScheduleEntity schedule : schedules) {
			if (schedule.getIsPaid()) {
				continue;
			}
			long overdueAmount = schedule.getOverdueAmount();
			long interest = schedule.getScheduledInterest();
			long principal = schedule.getScheduledPrincipal();
			long paid = schedule.getActualPaidAmount();
			long paymentRound = schedule.getPaymentRound();

			if(currentPaymentRound < paymentRound) { // 중도상환
				long tmp = principal - paid;
			} else {
				amounts += overdueAmount + interest + principal - paid;
			}
		}
		return amounts;
	}
}

