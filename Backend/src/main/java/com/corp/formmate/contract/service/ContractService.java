package com.corp.formmate.contract.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
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
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;
import com.corp.formmate.user.dto.AuthUser;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractService {

	// TODO: Repository 함수 예외 처리 등 중복 요소 service 단으로 빼서 리팩토링
	private final ContractRepository contractRepository;
	private final FormRepository formRepository;
	private final TransferRepository transferRepository;
	private final PaymentPreviewService paymentPreviewService;

	@Transactional
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
		List<TransferEntity> transfers = transferRepository.findByForm(form)
			.orElseThrow(() -> new TransferException(ErrorCode.TRANSFER_NOT_FOUND));

		// 찾은 거래내역들 기반으로 중도상환 수수료 총액 계산후 필드에 주입
		Long totalEarlyRepaymentCharge = 0L;
		for (TransferEntity t : transfers) {
			if (t.getStatus() == TransferStatus.EARLY_REPAYMENT) {
				totalEarlyRepaymentCharge -= t.getPaymentDifference() * form.getEarlyRepaymentFeeRate().longValue();
			}
		}
		contractDetail.setTotalEarlyRepaymentCharge(totalEarlyRepaymentCharge);
		contractDetail.setOverdueLimit(form.getOverdueLimit());

		return contractDetail;
	}

	@Transactional
	public ExpectedPaymentAmountResponse selectExpectedPaymentAmount(Integer formId) {
		/**
		 * 1. 계약서 기반으로 해당 회차에 납부할 금액 추출
		 * 2. 중도상환 수수료율 더해서 추출
		 */
		// 계약서와 계약관리 정보 생성
		ExpectedPaymentAmountResponse expectedPaymentAmountResponse = null;
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		Page<PaymentScheduleResponse> paymentSchedulePage = getPaymentScheduleResponses(
			contract, form);

		// 중도상환액이 있을 경우 예상 납부 금액을 다시 산정하기 때문에 첫째 달로 선정
		Integer currentPaymentRound = contract.getTotalEarlyRepaymentFee() > 0 ? 1 : contract.getCurrentPaymentRound();
		Long overdueAmount = contract.getOverdueAmount();

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

	@Transactional
	public InterestResponse selectInterestResponse(Integer formId) {
		/**
		 * 공통)
		 * - 이번 회차 미납 금액 -> 이번 회차 거래 있는지 확인하고, 있으면 회차
		 * - 원금(계약 금액 - 잔여 원금)
		 * - 이자 2개 / 중도상환수수료 / 만기일 예상 납부 금액(+그 중 이자)
		 * - 만기일 예상 납부 금액 중 원금(만기일 예상 납부 금액 - 그 중 이자)
		 * 1) 현재 연체액 있을 때
		 * - 공통처럼 뽑되, 이번 회차 미납 금액에 연체액 추가, 이번 회차 거래액 차감 X (분기 로직 추가)
		 */
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		Long totalEarlyRepaymentFee = contract.getTotalEarlyRepaymentFee();
		Long overdueAmount = contract.getOverdueAmount();
		Integer currentPaymentRound = contract.getCurrentPaymentRound();

		Long paidPrincipalAmount = form.getLoanAmount() - contract.getRemainingPrincipal();
		Long expectedMaturityPayment = contract.getExpectedMaturityPayment();
		Long expectedInterestAmountAtMaturity = contract.getExpectedInterestAmountAtMaturity();
		Long expectedPrincipalAmountAtMaturity = expectedMaturityPayment - expectedInterestAmountAtMaturity;
		Long unpaidAmount = 0L;

		// TODO: 메소드 내에서 계산하는 만기일 예상 납부 금액과 DB에 저장된 만기일 예상 납부 금액 비교 로직 추가
		PaymentPreviewRequest paymentPreview = new PaymentPreviewRequest(form);
		PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(paymentPreview,
			PageRequest.of(0, 10000));

		for (PaymentScheduleResponse p : paymentPreviewResponse.getSchedulePage()) {
			if (p.getInstallmentNumber().equals(currentPaymentRound)) {
				unpaidAmount = p.getPaymentAmount();
			}
		}

		if (overdueAmount == 0) {
			List<TransferEntity> transfers = transferRepository.findByForm(form)
				.orElseThrow(() -> new TransferException(ErrorCode.TRANSFER_NOT_FOUND));
			for (TransferEntity t : transfers) {
				if (t.getCurrentRound().equals(currentPaymentRound)) {
					unpaidAmount -= t.getAmount();
				}
			}
		} else {
			unpaidAmount += overdueAmount;
		}

		return InterestResponse.builder()
			.paidPrincipalAmount(paidPrincipalAmount)
			.paidInterestAmount(contract.getInterestAmount())
			.paidOverdueInterestAmount(contract.getOverdueInterestAmount())
			.totalEarlyRepaymentFee(contract.getTotalEarlyRepaymentFee())
			.unpaidAmount(unpaidAmount)
			.expectedPaymentAmountAtMaturity(expectedMaturityPayment)
			.expectedPrincipalAmountAtMaturity(expectedPrincipalAmountAtMaturity)
			.expectedInterestAmountAtMaturity(expectedInterestAmountAtMaturity)
			.build();
	}

	@Transactional
	public List<ContractWithPartnerResponse> selectContractWithPartner(Integer userId, Integer partnerId) {
		List<ContractWithPartnerResponse> list = new ArrayList<>();

		Page<FormEntity> userIsCreditorSideForms = formRepository.findUserIsCreditorSideForms(userId, partnerId,
			PageRequest.of(0, 10000));
		Page<FormEntity> userIsDebtorSideForms = formRepository.findUserIsDebtorSideForms(userId, partnerId,
			PageRequest.of(0, 10000));

		LocalDateTime now = LocalDateTime.now();

		for (FormEntity f : userIsCreditorSideForms) {
			if (f.getMaturityDate().isAfter(now)) {
				ExpectedPaymentAmountResponse expectedPaymentAmountResponse = selectExpectedPaymentAmount(f.getId());
				ContractEntity contract = contractRepository.findByForm(f)
					.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
				String contractDuration =
					f.getContractDate().toLocalDate().toString() + " ~ " + f.getMaturityDate().toLocalDate().toString();

				list.add(ContractWithPartnerResponse.builder()
					.userIsCreditor(true)
					.nextRepaymentAmount(expectedPaymentAmountResponse.getMonthlyRemainingPayment())
					.nextRepaymentDate(contract.getNextRepaymentDate())
					.contractDuration(contractDuration)
					.build());
			}
		}

		for (FormEntity f : userIsDebtorSideForms) {
			if (f.getMaturityDate().isAfter(now)) {
				ExpectedPaymentAmountResponse expectedPaymentAmountResponse = selectExpectedPaymentAmount(f.getId());
				ContractEntity contract = contractRepository.findByForm(f)
					.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));
				String contractDuration =
					f.getContractDate().toLocalDate().toString() + " ~ " + f.getMaturityDate().toLocalDate().toString();

				list.add(ContractWithPartnerResponse.builder()
					.userIsCreditor(false)
					.nextRepaymentAmount(expectedPaymentAmountResponse.getMonthlyRemainingPayment())
					.nextRepaymentDate(contract.getNextRepaymentDate())
					.contractDuration(contractDuration)
					.build());
			}
		}

		return list;
	}

	public Page<PaymentScheduleResponse> getPaymentScheduleResponses(ContractEntity contract, FormEntity form) {
		if (contract.getTotalEarlyRepaymentFee() > 0) {
			// 중도상환액이 있으면
			// 계약일을 오늘, 대출 금액을 계약관리 Entity의 잔여원금(원금 + 연체액)으로 바꿔서 예상 납부 금액 메소드 호출
			form.setContractDate(LocalDateTime.now());
			form.setLoanAmount(contract.getRemainingPrincipal());
		}
		// 없으면 원래 계약의 (균등)상환액에서 연체액만 더함
		PaymentPreviewRequest paymentPreview = new PaymentPreviewRequest(form);

		PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(paymentPreview,
			PageRequest.of(0, 10000));

		Page<PaymentScheduleResponse> paymentSchedulePage = paymentPreviewResponse.getSchedulePage();
		return paymentSchedulePage;
	}

	/**
	 * 사용자와 관련된 계약서 다 뽑음
	 * 계약서에서 userName이 채권자에 있으면 채무자, 채무자에 있으면 채권자로 주입
	 * 계약서에서 계약 만기일 추출
	 * 나머지 필드 -> InterestResponse(납부 요약 Response에서 추출
	 */
	@Transactional
	public List<ContractPreviewResponse> selectAllContractByStatus(FormStatus formStatus, AuthUser authUser) {
		List<ContractPreviewResponse> list = new ArrayList<>();
		Page<FormEntity> allWithFilters = formRepository.findAllWithFilters(authUser.getId(), formStatus, null,
			PageRequest.of(0, 10000));

		String username = authUser.getUsername();

		for (FormEntity f : allWithFilters) {
			ContractPreviewResponse contractPreviewResponse = new ContractPreviewResponse();
			contractPreviewResponse.setStatus(formStatus);

			if (f.getCreditorName().equals(username)) {
				contractPreviewResponse.setUserIsCreditor(true);
				contractPreviewResponse.setContracteeName(f.getDebtorName());
			} else if (f.getDebtorName().equals(username)) {
				contractPreviewResponse.setUserIsCreditor(false);
				contractPreviewResponse.setContracteeName(f.getCreditorName());
			}

			contractPreviewResponse.setMaturityDate(f.getMaturityDate().toLocalDate());

			InterestResponse interestResponse = selectInterestResponse(f.getId());
			contractPreviewResponse.setNextRepaymentAmount(interestResponse.getUnpaidAmount());
			contractPreviewResponse.setTotalAmountDue(
				interestResponse.getPaidPrincipalAmount() + interestResponse.getPaidInterestAmount()
					+ interestResponse.getPaidOverdueInterestAmount());
			contractPreviewResponse.setTotalRepaymentAmount(
				contractPreviewResponse.getTotalAmountDue() + interestResponse.getExpectedPaymentAmountAtMaturity());

			list.add(contractPreviewResponse);
		}

		return list;
	}

	@Transactional
	public AmountResponse selectAmounts(AuthUser authUser) {
		AmountResponse amountResponse = new AmountResponse();
		Long paidAmount = 0L;
		Long expectedTotalRepayment = 0L;
		Long receivedAmount = 0L;
		Long expectedTotalReceived = 0L;
		Page<FormEntity> allWithFilters = formRepository.findAllWithFilters(authUser.getId(), null, null,
			PageRequest.of(0, 10000));

		String username = authUser.getUsername();
		for (FormEntity f : allWithFilters) {
			InterestResponse interestResponse = selectInterestResponse(f.getId());
			if (f.getCreditorName().equals(username)) {
				receivedAmount += (interestResponse.getPaidPrincipalAmount() + interestResponse.getPaidInterestAmount()
					+ interestResponse.getPaidOverdueInterestAmount());
				expectedTotalReceived += interestResponse.getExpectedPaymentAmountAtMaturity();
			} else if (f.getDebtorName().equals(username)) {
				paidAmount += (interestResponse.getPaidPrincipalAmount() + interestResponse.getPaidInterestAmount()
					+ interestResponse.getPaidOverdueInterestAmount());
				expectedTotalRepayment += interestResponse.getExpectedPaymentAmountAtMaturity();
			}
		}

		amountResponse.setPaidAmount(paidAmount);
		amountResponse.setExpectedTotalRepayment(expectedTotalRepayment);
		amountResponse.setReceivedAmount(receivedAmount);
		amountResponse.setExpectedTotalReceived(expectedTotalReceived);
		return amountResponse;
	}

	public ContractEntity selectTransferByForm(FormEntity form) {
		ContractEntity contractEntity = contractRepository.findByForm(form).orElse(null);
		if (contractEntity == null) {
			throw new ContractException(ErrorCode.CONTRACT_NOT_FOUND);
		}
		return contractEntity;
	}

	// TODO: 송금 API에서 사용할 계약관리 테이블 업데이트 메소드(중도상환액, 연체액, 잔여원금, 중도상환수수료 등) 만들기 -> 동욱이형 API 짤 때 합의
	// TODO: 공통) 잔여원금, 이자 금액, 연체 이자 금액 업데이트
	// TODO: - 연체 금액 있을 경우: 잔여원금-연체금액(연체금액 있을 경우), 연체 금액도 업데이트
	// TODO: 중도상환) 잔여원금(중도상환수수료 추가), 중도상환 횟수/금액, 만기일 예상 납부 금액/이자 업데이트

	// TODO: 납부일 다음 날 스케줄러 업데이트 메소드 제작
	// TODO: 공통) 현재 회차, 다음 상환 날짜 업데이트
	// TODO: 연체 시) 연체 횟수/금액, 이자 금액, 연체 이자 금액 업데이트
	// TODO: 연체 금액 필드는 현재 연체액을 나타내므로 (연체액 + 연체 이자)를 더하기
}
