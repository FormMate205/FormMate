package com.corp.formmate.contract.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.AmountResponse;
import com.corp.formmate.contract.dto.ContractDetailResponse;
import com.corp.formmate.contract.dto.ContractPreviewResponse;
import com.corp.formmate.contract.dto.ContractWithPartnerResponse;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountResponse;
import com.corp.formmate.contract.dto.InterestResponse;
import com.corp.formmate.contract.dto.MonthlyContractDetail;
import com.corp.formmate.contract.dto.MonthlyContractResponse;
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
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.transfer.dto.TransferCreateRequest;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.entity.TransferStatus;
import com.corp.formmate.transfer.repository.TransferRepository;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {

	// TODO: Repository 함수 예외 처리 등 중복 요소 service 단으로 빼서 리팩토링
	private final ContractRepository contractRepository;
	private final FormRepository formRepository;
	private final TransferRepository transferRepository;
	private final PaymentPreviewService paymentPreviewService;
	private final UserRepository userRepository;

	@Transactional
	public ContractDetailResponse selectContractDetail(AuthUser user, Integer formId) {
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

		UserEntity userEntity = userRepository.findById(user.getId())
			.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		String username = userEntity.getUserName();
		boolean userIsCreditor = form.getCreditorName().equals(username);
		String contracteeName = userIsCreditor ? form.getDebtorName() : form.getCreditorName();
		contractDetail.setUserIsCreditor(userIsCreditor);
		contractDetail.setContracteeName(contracteeName);

		// 찾은 거래내역들 기반으로 중도상환 수수료 총액 계산후 필드에 주입
		Long totalEarlyRepaymentCharge = 0L;
		Long repaymentAmount = 0L;
		for (TransferEntity t : transfers) {
			if (t.getCurrentRound().intValue() != 0) {
				repaymentAmount += t.getAmount();
			}
			if (t.getStatus() == TransferStatus.EARLY_REPAYMENT) {
				totalEarlyRepaymentCharge -= BigDecimal.valueOf(t.getPaymentDifference()).multiply(form.getEarlyRepaymentFeeRate()).longValue();
			}
		}
		contractDetail.setRemainingPrincipal(contract.getRemainingPrincipal());
		contractDetail.setRepaymentAmount(repaymentAmount);
		contractDetail.setTotalEarlyRepaymentCharge(totalEarlyRepaymentCharge);
		contractDetail.setOverdueLimit(form.getOverdueLimit());

		return contractDetail;
	}

	@Transactional
	public ExpectedPaymentAmountResponse selectExpectedPaymentAmount(Integer formId) {
		/**
		 * 1. 계약서 기반으로 해당 회차에 납부할 금액 추출 (예상 납부 스케줄 메소드로)
		 * 2. 중도상환 수수료율 더해서 추출
		 * -> 송금내역에 현재 회차 송금 기록 있으면 paymentDifference 필드 기반으로 해당 회차 납부 금액 반환함
		 */
		// 계약서와 계약관리 정보 생성
		ExpectedPaymentAmountResponse expectedPaymentAmountResponse = new ExpectedPaymentAmountResponse();
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new FormException(ErrorCode.FORM_NOT_FOUND));
		ContractEntity contract = contractRepository.findByForm(form)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		expectedPaymentAmountResponse.setEarlyRepaymentFeeRate(form.getEarlyRepaymentFeeRate());

		Page<PaymentScheduleResponse> paymentSchedulePage = getPaymentScheduleResponses(
			contract, form);

		if (contract.getTotalEarlyRepaymentFee() > 0) {
			// 중도상환액이 있을 경우 해당 회차 상환액은 다 내고 추가로 낸 것이므로 0원
			expectedPaymentAmountResponse.setMonthlyRemainingPayment(0L);
		} else {
			List<TransferEntity> transfers = transferRepository.findByFormOrderByCreatedAtDesc(form);
			Integer currentPaymentRound1 = contract.getCurrentPaymentRound();

			// 현재 회차 송금 중 가장 마지막 송금(desc로 뽑았으니까)의 PaymentDifference와 0 중 가장 큰 것으로 설정
			if (transfers != null && !transfers.isEmpty()) {
				for (TransferEntity t : transfers) {
					if (t.getCurrentRound().equals(currentPaymentRound1)) {
						expectedPaymentAmountResponse.setMonthlyRemainingPayment(Math.max(0, t.getPaymentDifference()));
						break;
					}
				}
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

		UserEntity user = userRepository.findById(authUser.getId())
			.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		String username = user.getUserName();

		for (FormEntity f : allWithFilters) {
			ContractPreviewResponse contractPreviewResponse = new ContractPreviewResponse();
			contractPreviewResponse.setFormId(f.getId());
			contractPreviewResponse.setStatus(f.getStatus());

			// TODO: userIsCreditor가 무조건 false, contracteeName(계약 상대 이름)이 무조건 null로 나오는 문제 수정
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
	 * 공통)
	 * 사용자의 계약 중 viewDate 기준으로 종료되지 않은 계약+계약관리 뽑고,
	 * 현재 잔여원금 기준으로 PaymentSchedule(예상 납부 스케줄) 뽑아서 추출
	 * 추출 회차)
	 * 1. viewDate.month >= now.month일 때
	 * - now - viewDate == 0일 경우 예외 케이스 부분 참조, 아닐 경우 month 차이(계약일, 만기일)
	 * - PaymentSchedule의 납부액에 연체액 추가
	 * 2. viewDate.month < now.month일 때
	 * - 추출 회차 안 뽑아도 됨, 해당 월 송금액 전체 표시
	 * 예외 케이스)
	 * 1. now.month == viewDate.month && now.day > viewDate.day일 때
	 * 1.1. 연체액 있을 때 -> 연체액 표시
	 * 1.2. 중도상환액 있을 때 -> 0원
	 * 2. now.month == viewDate.month && now.day <= viewDate.day일 때
	 * 2.1. 당월 송금액 차감해야 함
	 * 2.2. 연체액 있을 때 -> 차감액에 연체액 더해서 표시
	 * 2.3. 중도상환액 있을 때 -> PaymentSchedule로 추출
	 * 3. now.month < viewDate.month && now.day > viewDate.day일 때 -> month 차이
	 * 3.1. now.month < viewDate.month && now.day < viewDate.day일 때 -> month 차이+1
	 */
	@Transactional
	public Map<Integer, MonthlyContractResponse> selectMonthlyContracts(AuthUser user, LocalDate now, LocalDate viewDate) {
		log.info("now = {}, viewDate = {}", now, viewDate);
		Map<Integer, MonthlyContractResponse> map = new HashMap<>();
		Page<FormEntity> allWithFilters = formRepository.findAllWithFilters(user.getId(), null, null,
			PageRequest.of(0, 10000));

		// 회차 구하기(해당 월(회차)에 납부할 돈 구하기 위해)
		// ChronoUnit.MONTHS.between은 두 날짜가 절대적으로 몇 달 차가 나는지 연산
		// ex) 2023.01.01 - 2024.02.02 -> 13 반환
		long betweenMonths = ChronoUnit.MONTHS.between(now, viewDate);
		log.info("now와 viewDate의 betweenMonths = {}", betweenMonths);

		for (FormEntity f : allWithFilters) {
			LocalDate maturityDate = f.getMaturityDate().toLocalDate();
			if (maturityDate.isBefore(viewDate)) {
				continue;
			}

			int day = maturityDate.getDayOfMonth();
			if (!map.containsKey(day)) {
				MonthlyContractResponse monthlyContractResponse = new MonthlyContractResponse();
				map.put(day, monthlyContractResponse);
			}

			MonthlyContractDetail monthlyContractDetail = new MonthlyContractDetail();
			boolean userIsCreditor = f.getCreditorName().equals(user.getUsername());
			String contracteeName = userIsCreditor ? f.getDebtorName() : f.getCreditorName();
			monthlyContractDetail.setUserIsCreditor(userIsCreditor);
			monthlyContractDetail.setContracteeName(contracteeName);

			ContractEntity contract = contractRepository.findByForm(f)
				.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

			MonthlyContractResponse monthlyContractResponse = map.get(f.getMaturityDate().getDayOfMonth());
			List<MonthlyContractDetail> contractDetails = monthlyContractResponse.getContracts();

			if (betweenMonths == 0) {
				// 당월의 납부 '계획'을 볼 때
				PaymentPreviewRequest paymentPreviewRequest = new PaymentPreviewRequest(f);
				PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(
					paymentPreviewRequest, PageRequest.of(0, 10000));
				Page<PaymentScheduleResponse> schedulePage = paymentPreviewResponse.getSchedulePage();

				int betweenDays = now.getDayOfMonth() - viewDate.getDayOfMonth();
				if (betweenDays <= 0) {
					// 납부일 안 지났을 때 (예외 케이스 2)
					if (contract.getTotalEarlyRepaymentFee() > 0) {
						// 중도상환액 있을 때 -> 0원
						monthlyContractDetail.setRepaymentAmount(0L);
					} else {
						// 중도상환액 없을 때
						// 연체액이 있을 때 -> 당월 상환 금액 원금을 못 갚았다는 뜻이므로 당월 상환 예상 금액에 연체액 더함
						if (contract.getOverdueAmount() > 0) {
							Integer currentPaymentRound = contract.getCurrentPaymentRound();

							for (PaymentScheduleResponse p : schedulePage) {
								if (p.getInstallmentNumber().equals(currentPaymentRound)) {
									monthlyContractDetail.setRepaymentAmount(p.getPaymentAmount() + contract.getOverdueAmount());
									break;
								}
							}
						} else {
							// 연체액이 없을 때 -> 당월 상환 예상 금액 - 당월 총 송금액
							Long repaymentAmount = 0L;
							Integer currentPaymentRound = contract.getCurrentPaymentRound();

							for (PaymentScheduleResponse p : schedulePage) {
								if (p.getInstallmentNumber().equals(currentPaymentRound)) {
									repaymentAmount = p.getPaymentAmount();
									break;
								}
							}

							List<TransferEntity> transfers = transferRepository.findByForm(f)
								.orElseThrow(() -> new TransferException(ErrorCode.TRANSFER_NOT_FOUND));

							Long sumTransferAmount = 0L;
							for (TransferEntity t : transfers) {
								LocalDate transferDate = t.getTransactionDate().toLocalDate();
								if (transferDate.getYear() == viewDate.getYear() && transferDate.getMonth() == viewDate.getMonth()) {
									sumTransferAmount += t.getAmount();
								}
							}

							monthlyContractDetail.setRepaymentAmount(repaymentAmount - sumTransferAmount);
						}
					}

					// 당월 송금액 차감
				} else {
					// 납부일 지났을 때 (예외 케이스 1)
					if (contract.getTotalEarlyRepaymentFee() == 0) {
						// 연체액 있을 때 -> 연체액 표시
						monthlyContractDetail.setRepaymentAmount(contract.getOverdueAmount());
					} else {
						// 중도상환액 있을 때 -> 0원
						monthlyContractDetail.setRepaymentAmount(0L);
					}
				}
			} else if (betweenMonths > 0) {
				// 당월(현재)보다 미래 달의 납부 '계획'을 볼 때
				PaymentPreviewRequest paymentPreviewRequest = new PaymentPreviewRequest(f);
				PaymentPreviewResponse paymentPreviewResponse = paymentPreviewService.calculatePaymentPreview(
					paymentPreviewRequest, PageRequest.of(0, 10000));
				Page<PaymentScheduleResponse> schedulePage = paymentPreviewResponse.getSchedulePage();

				for (PaymentScheduleResponse p : schedulePage) {
					if (p.getInstallmentNumber().intValue() == betweenMonths) {
						monthlyContractDetail.setRepaymentAmount(p.getPaymentAmount() + contract.getOverdueAmount());
						break;
					}
				}

				// betweenMonth == 1일 때 연체액 추가해줘야 함
			} else {
				// 당월(현재)보다 이전의 납부 '내역'을 볼 때
				List<TransferEntity> transfers = transferRepository.findByForm(f)
					.orElseThrow(() -> new TransferException(ErrorCode.TRANSFER_NOT_FOUND));

				Long sumTransferAmount = 0L;
				for (TransferEntity t : transfers) {
					LocalDate transferDate = t.getTransactionDate().toLocalDate();
					if (transferDate.getYear() == viewDate.getYear() && transferDate.getMonth() == viewDate.getMonth()) {
						sumTransferAmount += t.getAmount();
					}
				}

				monthlyContractDetail.setRepaymentAmount(sumTransferAmount);
			}

			contractDetails.add(monthlyContractDetail);
		}

		return map;
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
