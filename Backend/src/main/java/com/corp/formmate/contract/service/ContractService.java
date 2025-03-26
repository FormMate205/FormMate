package com.corp.formmate.contract.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.contract.repository.ContractRepository;
import com.corp.formmate.form.dto.PaymentPreviewRequest;
import com.corp.formmate.form.dto.PaymentPreviewResponse;
import com.corp.formmate.form.dto.PaymentScheduleResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.form.service.PaymentPreviewService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractService {

	private final ContractRepository contractRepository;
	private final FormRepository formRepository;
	private final TransferRepository transferRepository;
	private final PaymentPreviewService paymentPreviewService;

	public ContractDetailResponse selectContractDetail(Integer formId) {
		// formId에 맞는 계약서 찾기
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		// 찾은 계약서에 대한 계약관리 찾기
		// 계약관리에 중도상환 수수료 총액 제외하고는 다른 필드 있어서 계약관리 객체로 계약 상세 객체 생성
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
		ContractDetailResponse contractDetail = new ContractDetailResponse(contract);

		// 계약서와 관련된 거래내역들 찾기
		List<TransferEntity> transfers = transferRepository.findByForm(form);

		// 찾은 거래내역들 기반으로 중도상환 수수료 총액 계산후 필드에 주입
		Long totalEarlyRepaymentCharge = 0L;
		for (TransferEntity t : transfers) {
			if (t.getStatus() == TransferStatus.EARLY_REPAYMENT) {
				totalEarlyRepaymentCharge -= t.getPaymentDifference() * form.getEarlyRepaymentFeeRate().longValue();
			}
		}
		contractDetail.setTotalEarlyRepaymentCharge(totalEarlyRepaymentCharge);

		return contractDetail;
	}

	public ExpectedPaymentAmountResponse selectExpectedPaymentAmount(Integer formId) {
		/**
		 * 1. 계약서 기반으로 해당 회차에 납부할 금액 추출
		 * 2. 해당 회차 납부 금액 + 연체액
		 * 2.1. 중도상환 금액이 있을 경우 2에서 차감 + 중도상환수수료 추가
		 * 3. 중도상환 수수료 더해서 추출
		 */
		// 계약서와 계약관리 정보 생성
		ExpectedPaymentAmountResponse expectedPaymentAmountResponse = null;
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		if (contract.getTotalEarlyRepaymentFee() > 0) {
			// 중도상환액이 있으면
			// 계약일을 오늘, 대출 금액을 계약관리 Entity의 잔여원금(원금 + 연체액 + 중도상환수수료)으로 바꿔서 예상 납부 금액 메소드 호출
			form.setContractDate(LocalDateTime.now());
			form.setLoanAmount(contract.getRemainingPrincipal());
		}
		// 없으면 원래 계약의 (균등)상환액에서 연체액만 더함
		PaymentPreviewRequest paymentPreview = new PaymentPreviewRequest(form);

		PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(paymentPreview,
			PageRequest.of(0, 10000));

		Page<PaymentScheduleResponse> paymentSchedulePage = paymentPreviewResponse.getSchedulePage();

		// 중도상환액이 있을 경우 잔여원금에 연체액과 중도상환수수료도 이미 계산되어 있는 상태에서 납부 예정 금액을 다시 산정하기 때문에 전처리
		Integer currentPaymentRound = contract.getTotalEarlyRepaymentFee() > 0 ? 1 : contract.getCurrentPaymentRound();
		Long overdueAmount = contract.getTotalEarlyRepaymentFee() > 0 ? 0 : contract.getOverdueAmount();

		for (PaymentScheduleResponse p : paymentSchedulePage) {
			if (p.getInstallmentNumber().equals(currentPaymentRound)) {
				expectedPaymentAmountResponse = ExpectedPaymentAmountResponse.builder()
					.monthlyRemainingPayment(overdueAmount + p.getPaymentAmount())
					.earlyRepaymentFeeRate(form.getEarlyRepaymentFeeRate())
					.build();
			}
		}
		return expectedPaymentAmountResponse;
	}

	public InterestResponse selectInterestResponse(Integer formId) {
		/**
		 * 1. 중도상환액 + 현재 연체액이 없을 때
		 * - Page<PaymentScheduleResponse>에서 전 회차 정보의 원금,이자 합산해서 생성
		 * 2. 중도상환액만 있을 때
		 * - 1에 중도상환 수수료 합산해서
		 * 3. 연체액만 있을 때
		 * - 1처럼 뽑되, 계약서에서 계약금액을 contract.getRemainingPrincipal()로 뽑아서
		 * - 현재 미납부 금액 필드에 연체액
		 */
		InterestResponse interestResponse = new InterestResponse();
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		Long totalEarlyRepaymentFee = contract.getTotalEarlyRepaymentFee();
		Long overdueAmount = contract.getOverdueAmount();

		if (totalEarlyRepaymentFee == 0 && overdueAmount == 0) {
			PaymentPreviewRequest paymentPreview = new PaymentPreviewRequest(form);

			PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(paymentPreview,
				PageRequest.of(0, 10000));

			Page<PaymentScheduleResponse> paymentSchedulePage = paymentPreviewResponse.getSchedulePage();

			Integer currentPaymentRound = contract.getCurrentPaymentRound();
			Long paidPrincipalAmount = 0L;
			Long paidInterestAmount = 0L;
			for (PaymentScheduleResponse p : paymentSchedulePage) {
				// 현재 회차일 때
				if (p.getInstallmentNumber().equals(currentPaymentRound)) break;
				paidPrincipalAmount += p.getPaymentAmount();
				paidInterestAmount += p.getInterest();
			}
		} else if (totalEarlyRepaymentFee > 0) {

		} else if (overdueAmount > 0) {

		}

		// 중도상환액, 연체액 음수일 때 터짐
		throw new ContractException(ErrorCode.INTERNAL_SERVER_ERROR);
	}

	// TODO: 송금 API에서 사용할 계약관리 테이블 업데이트 메소드(중도상환액, 연체액, 잔여원금, 중도상환수수료 등) 만들기 -> 동욱이형 API 짤 때 합의
	// TODO: 공통) 잔여원금, 이자 금액, 연체 이자 금액 업데이트
	// TODO: - 연체 금액 있을 경우: 잔여원금-연체금액(연체금액 있을 경우), 연체 금액도 업데이트
	// TODO: 중도상환) 잔여원금(중도상환수수료 추가), 중도상환 횟수/금액, 만기일 예상 납부 금액/이자 업데이트

	// TODO: 납부일 다음 날 스케줄러 업데이트 메소드 제작
	// TODO: 공통) 현재 회차 업데이트
	// TODO: 연체 시) 연체 횟수/금액, 이자 금액, 연체 이자 금액 업데이트
	// TODO: 연체 금액 필드는 현재 연체액을 나타내므로 (연체액 + 연체 이자)를 더하기
}
