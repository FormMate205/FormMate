package com.corp.formmate.paymentschedule.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.service.EnhancedPaymentPreviewService;
import com.corp.formmate.form.service.PaymentPreviewService;
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

}

