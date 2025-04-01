package com.corp.formmate.contract.service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import com.corp.formmate.transfer.dto.TransferCreateRequest;
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
		// TODO: (중요) 송금내역에 현재 회차 송금 기록 있으면 paymentDifference 필드 기반으로 해당 회차 납부 금액 반환하기
		// TODO: 현재 로직은 현재 회차 송금 기록 없을 때를 가정한 것임 (로직 추가 필수)
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
			contractPreviewResponse.setFormId(f.getId());
			contractPreviewResponse.setStatus(f.getStatus());

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

	/**
	 * Input
	 * 1. 계약서 ID
	 * 2. 상대방 유저 ID
	 * 3. 상환 예정액
	 * 4. 송금 금액
	 * 설계
	 * 연체 금액 있을 경우 -> 연체금액 관련 필드부터 처리(현재 연체 금액, 잔여원금(+연체 뺀 잔여원금), 누적 연체 이자)
	 * 1. 중도상환 송금일 경우 -> 만기일 예상 납부 금액(+이자)는 이 때만 바뀜 (중도상환 수수료 때문에)
	 * 2. 납부 송금일 경우
	 * 3. 연체 송금일 경우
	 */
	@Transactional
	public void updateContract(TransferCreateRequest request) {
		FormEntity form = formRepository.findById(request.getFormId())
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		Long amount = request.getAmount();
		Long repaymentAmount = request.getRepaymentAmount();
		// 연체금액 처리 로직에서 amount 차감되니까 여기서 미리 계산함
		long diff = amount - repaymentAmount;
		Long overdueAmount = contract.getOverdueAmount();
		Long remainingPrincipal = contract.getRemainingPrincipal();
		Long remainingPrincipalMinusOverdue = contract.getRemainingPrincipalMinusOverdue();

		// 연체금액 처리 로직(현재 연체금액부터 차감)
		if (overdueAmount > 0) {
			// 송금액 >= 연체액일 때
			if (amount >= overdueAmount) {
				// 현재 송금에서 낸 연체 이자
				long overdueInterest = BigDecimal.valueOf(overdueAmount).multiply(form.getOverdueInterestRate()).longValue();

				// 현재 연체 금액은 0원이 됨
				contract.setOverdueAmount(0L);

				// 이자 금액, 연체 이자 금액 필드 업데이트
				contract.setOverdueInterestAmount(contract.getOverdueInterestAmount() + overdueInterest);
				contract.setInterestAmount(contract.getInterestAmount() + overdueInterest);

				// 송금 금액에서 연체액 차감
				amount -= overdueAmount;

				// 잔여 원금, 연체액 뺀 잔여원금 필드에 상환한 연체액 차감
				remainingPrincipal -= overdueAmount;
				remainingPrincipalMinusOverdue -= overdueAmount;
			} else {
				// 송금액 < 연체액일 때
				// 현재 송금에서 낸 연체 이자
				long overdueInterest = BigDecimal.valueOf(amount).multiply(form.getOverdueInterestRate()).longValue();

				// 이자 금액, 연체 이자 금액 필드 업데이트
				contract.setOverdueInterestAmount(contract.getOverdueInterestAmount() + overdueInterest);
				contract.setInterestAmount(contract.getInterestAmount() + overdueInterest);

				// 현재 연체 금액 업데이트 (위 분기와 달리 0원이 되지는 않음)
				overdueAmount -= amount;
				contract.setOverdueAmount(overdueAmount);

				// 송금액 < 연체액이므로
				// 잔여 원금, 연체액 뺀 잔여원금 필드 송금액만큼 차감하고 update 후 메소드 종료
				remainingPrincipal -= amount;
				remainingPrincipalMinusOverdue -= amount;
				contract.setRemainingPrincipal(remainingPrincipal);
				contract.setRemainingPrincipalMinusOverdue(remainingPrincipalMinusOverdue);
				contractRepository.save(contract);
				return;
			}
		}

		if (diff >= 0) {
			// 연체, 납부 송금
			contract.setTotalEarlyRepaymentFee(0L); // 총 중도 상환 금액 필드 0이 됨(중도상환 송금이 아니니)

			remainingPrincipal -= amount;
			remainingPrincipalMinusOverdue -= overdueAmount;
			// 이번 송금에서 낸 이자
			long interest = BigDecimal.valueOf(amount).multiply(form.getInterestRate()).longValue();
			contract.setInterestAmount(contract.getInterestAmount() + interest);
			contract.setRemainingPrincipal(remainingPrincipal);
			contract.setRemainingPrincipalMinusOverdue(remainingPrincipalMinusOverdue);
			contractRepository.save(contract);
		} else {
			// 중도상환
			contract.setTotalEarlyRepaymentFee(-diff); // 중도상환한 만큼으로 바뀜

			// 잔여 원금 관련 필드에서 이번 달 상환액만큼만 차감
			remainingPrincipal -= repaymentAmount;
			remainingPrincipalMinusOverdue -= repaymentAmount;
			long interest = BigDecimal.valueOf(repaymentAmount).multiply(form.getInterestRate()).longValue();
			contract.setInterestAmount(contract.getInterestAmount() + interest);

			// 이번 달 상환액을 제외한 나머지 금액은 이자 금액, 중도상환수수료를 차감하고 원금을 차감해야 함
			amount -= repaymentAmount; // 이번 달 상환액을 제외한 나머지 금액
			interest = BigDecimal.valueOf(amount).multiply(form.getInterestRate()).longValue();
			long earlyRepaymentFee = BigDecimal.valueOf(amount).multiply(form.getEarlyRepaymentFeeRate()).longValue(); // 나머지 금액만큼에서 중도상환수수료 계산
			long deductedAmount = amount - interest - earlyRepaymentFee; // 원금에서 차감할 금액(나머지 금액 - 이자 금액 - 중도상환수수료)
			contract.setInterestAmount(contract.getInterestAmount() + interest);
			remainingPrincipal -= deductedAmount;
			remainingPrincipalMinusOverdue -= deductedAmount;
			contract.setRemainingPrincipal(remainingPrincipal);
			contract.setRemainingPrincipalMinusOverdue(remainingPrincipalMinusOverdue);
			// 중도상환수수료만큼 만기일 예상 납부 금액 추가
			contract.setExpectedMaturityPayment(contract.getExpectedMaturityPayment() + earlyRepaymentFee);
			contractRepository.save(contract);
		}
	}

	@Transactional
	public void createContract(FormEntity form) {
		ContractEntity contract = new ContractEntity();
		contract.setForm(form);
		contract.setOverdueCount(0);
		contract.setOverdueAmount(0L);
		LocalDate now = LocalDate.now();
		contract.setNextRepaymentDate(LocalDate.of(now.getDayOfYear(), now.getDayOfMonth(), form.getRepaymentDay()));
		contract.setEarlyRepaymentCount(0);
		contract.setTotalEarlyRepaymentFee(0L);
		Long loanAmount = form.getLoanAmount();
		contract.setRemainingPrincipal(loanAmount);
		contract.setRemainingPrincipalMinusOverdue(loanAmount);
		contract.setInterestAmount(0L);
		contract.setOverdueInterestAmount(0L);

		PaymentPreviewRequest paymentPreview = new PaymentPreviewRequest(form);
		PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(paymentPreview,
			PageRequest.of(0, 10000));
		Page<PaymentScheduleResponse> schedulePage = paymentPreviewResponse.getSchedulePage();

		Long expectedMaturityPayment = 0L;
		Long expectedInterestAmountAtMaturity = 0L;
		for (PaymentScheduleResponse p : schedulePage) {
			expectedMaturityPayment += p.getPrincipal();
			expectedInterestAmountAtMaturity += p.getInterest();
		}
		contract.setExpectedMaturityPayment(expectedMaturityPayment);
		contract.setExpectedInterestAmountAtMaturity(expectedInterestAmountAtMaturity);

		contractRepository.save(contract);
	}


	// TODO: 납부일 다음 날 스케줄러 업데이트 메소드 제작
	// TODO: 공통) 현재 회차, 다음 상환 날짜 업데이트
	// TODO: 연체 시) 연체 횟수/금액, 이자 금액, 연체 이자 금액 업데이트
	// TODO: 연체 금액 필드는 현재 연체액을 나타내므로 (연체액 + 연체 이자)를 더하기
}
