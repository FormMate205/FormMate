package com.corp.formmate.paymentschedule.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.service.EnhancedPaymentPreviewService;
import com.corp.formmate.form.service.PaymentPreviewService;
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
	private final PaymentPreviewService paymentPreviewService;
	private final EnhancedPaymentPreviewService enhancedPaymentPreviewService;

	@Transactional
	public void createSchedules(FormEntity form, ContractEntity contract) {
		PaymentPreviewRequest previewRequest = PaymentPreviewRequest.builder()
			.loanAmount(form.getLoanAmount())
			.interestRate(form.getInterestRate().toString())
			.repaymentMethod(form.getRepaymentMethod().getKorName())
			.repaymentDay(form.getRepaymentDay())
			.maturityDate(form.getMaturityDate())
			.build();

		PaymentPreviewResponse preview = paymentPreviewService.calculatePaymentPreview(previewRequest,
			Pageable.unpaged());

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
			.orElse(null);
	}

	@Transactional(readOnly = true)
	public PaymentScheduleEntity selectById(Integer id) {
		PaymentScheduleEntity schedule = paymentScheduleRepository.findById(id)
			.orElseThrow(() -> new PaymentScheduleException(
				ErrorCode.PAYMENT_SCHEDULE_NOT_FOUND));
		return schedule;
	}

}

