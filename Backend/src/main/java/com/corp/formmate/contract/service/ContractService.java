package com.corp.formmate.contract.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.corp.formmate.contract.dto.ContractDetailDto;
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
			.orElseThrow(() -> new ContractException(ErrorCode.CONTRACT_MANAGEMENT_NOT_FOUND));

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
}
