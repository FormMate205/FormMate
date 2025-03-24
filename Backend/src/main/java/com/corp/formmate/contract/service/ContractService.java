package com.corp.formmate.contract.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.ContractDetailDto;
import com.corp.formmate.contract.dto.ExpectedPaymentAmountDto;
import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.contract.repository.ContractRepository;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.repository.FormRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;
import com.corp.formmate.transfer.entity.TransferEntity;
import com.corp.formmate.transfer.repository.TransferRepository;

@Service
public class ContractService {

	private ContractRepository contractRepository;
	private FormRepository formRepository;
	private TransferRepository transferRepository;

	public ContractDetailDto selectContractDetail(Integer formId) {
		// formId에 맞는 계약서 찾기
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		// 찾은 계약서에 대한 계약관리 찾기
		ContractEntity contract = contractRepository.findByForm(form);
		ContractDetailDto contractDetail = new ContractDetailDto(contract);

		// 계약서와 관련된 거래내역들 찾기
		List<TransferEntity> transfers = transferRepository.findByForm(form);

		// 찾은 거래내역들 기반으로 중도상환 수수료 총액 계산후 필드에 주입
		Long totalEarlyRepaymentCharge = 0L;
		for (TransferEntity t : transfers) {
			if (t.getStatus().getKorName().equals("중도상환")) {
				totalEarlyRepaymentCharge -= t.getPaymentDifference() * form.getEarlyRepaymentFeeRate().longValue();
			}
		}
		contractDetail.setTotalEarlyRepaymentCharge(totalEarlyRepaymentCharge);

		return contractDetail;
	}

	public ExpectedPaymentAmountDto selectExpectedPaymentAmount(Integer formId) {
		FormEntity form = formRepository.findById(formId)
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_NOT_FOUND));

		LocalDate contractDate = form.getContractDate();
		Integer dayOfContractDate = contractDate.getDayOfMonth();
		LocalDate manurityDate = form.getMaturityDate();
		Integer dayOfManurityDate = manurityDate.getDayOfMonth();
		Integer repaymentDay = form.getRepaymentDay();

		/**
		 * 문제 : 이번 달 갚을 금액을 어떻게 산정하나
		 */
		Period formPeriod = Period.between(contractDate, manurityDate);

		int a = formPeriod.getMonths(); // 전체 상환 회차

		if (repaymentDay >= dayOfContractDate && repaymentDay <= dayOfManurityDate) {
			a += 1;
		} else if (repaymentDay < dayOfContractDate && repaymentDay > dayOfManurityDate) {
			a -= 1;
		}

		return null;
	}
}
