package com.corp.formmate.contract.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.corp.formmate.contract.service.ContractService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueScheduler {

	private final ContractService contractService;

	@Scheduled(cron = "0 00 00 * * *")
	public void scheduleOverdue() {
		//		contractService.dailyContractUpdateJob();
		contractService.notifyRepaymentDueContracts();
		contractService.updateContractsNextRepayment();
	}
}
