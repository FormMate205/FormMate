package com.corp.formmate.contractmanagement.entity;

import java.time.LocalDate;

import com.corp.formmate.contract.entity.ContractEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contract_managements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractManagementEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// FK: contract_id -> contracts.id
	@ManyToOne
	@JoinColumn(name = "contract_id", nullable = false)
	private ContractEntity contract;

	@Column(name = "overdue_count", nullable = false)
	private Integer overdueCount = 0;

	@Column(name = "overdue_amount", nullable = false)
	private Long overdueAmount = 0L;

	@Column(name = "next_repayment_date", nullable = false)
	private LocalDate nextRepaymentDate;

	@Column(name = "early_repayment_count", nullable = false)
	private Integer earlyRepaymentCount = 0;

	@Column(name = "total_early_repayment_fee", nullable = false)
	private Long totalEarlyRepaymentFee = 0L;

	@Column(name = "remaining_principal")
	private Long remainingPrincipal;

	@Column(name = "remaining_principal_minus_overdue")
	private Long remainingPrincipalMinusOverdue;

	@Column(name = "interest_amount", nullable = false)
	private Long interestAmount = 0L;

	@Column(name = "overdue_interest_amount", nullable = false)
	private Long overdueInterestAmount = 0L;

	@Column(name = "expected_maturity_payment", nullable = false)
	private Long expectedMaturityPayment;

	@Column(name = "current_payment_round", nullable = false)
	private Integer currentPaymentRound = 1;
}