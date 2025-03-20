package com.corp.formmate.contract.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.corp.formmate.user.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ContractEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ContractStatus status;  // '상대승인전', '상대승인후', '진행중', '연체', '종료'

	// FK: creator_id -> users.id
	@ManyToOne
	@JoinColumn(name = "creator_id", nullable = false)
	private UserEntity creator;
	//
	// // FK: receiver_id -> users.id
	@ManyToOne
	@JoinColumn(name = "receiver_id", nullable = false)
	private UserEntity receiver;
	//
	// // FK: creditor_id -> users.id
	@ManyToOne
	@JoinColumn(name = "creditor_id", nullable = false)
	private UserEntity creditor;

	// FK: debtor_id -> users.id
	@ManyToOne
	@JoinColumn(name = "debtor_id", nullable = false)
	private UserEntity debtor;

	@Column(name = "creditor_name", length = 100, nullable = false)
	private String creditorName;

	@Column(name = "creditor_address", columnDefinition = "TEXT", nullable = false)
	private String creditorAddress;

	@Column(name = "creditor_phone", length = 20, nullable = false)
	private String creditorPhone;

	@Column(name = "creditor_bank", length = 50, nullable = false)
	private String creditorBank;

	@Column(name = "creditor_account", length = 50, nullable = false)
	private String creditorAccount;

	@Column(name = "debtor_name", length = 100, nullable = false)
	private String debtorName;

	@Column(name = "debtor_address", columnDefinition = "TEXT", nullable = false)
	private String debtorAddress;

	@Column(name = "debtor_phone", length = 20, nullable = false)
	private String debtorPhone;

	@Column(name = "debtor_bank", length = 50, nullable = false)
	private String debtorBank;

	@Column(name = "debtor_account", length = 50, nullable = false)
	private String debtorAccount;

	@Column(name = "contract_date", nullable = false)
	private LocalDate contractDate;

	@Column(name = "maturity_date", nullable = false)
	private LocalDate maturityDate;

	@Column(name = "loan_amount", nullable = false)
	private Long loanAmount;

	@Enumerated(EnumType.STRING)
	@Column(name = "repayment_method", nullable = false)
	private RepaymentMethod repaymentMethod;

	@Column(name = "repayment_day", nullable = false)
	private Integer repaymentDay;

	@Column(name = "interest_rate", precision = 4, scale = 2)
	private BigDecimal interestRate = BigDecimal.ZERO;

	@Column(name = "early_repayment_fee_rate", precision = 5, scale = 2)
	private BigDecimal earlyRepaymentFeeRate = BigDecimal.ZERO;

	@Column(name = "overdue_interest_rate", precision = 5, scale = 2)
	private BigDecimal overdueInterestRate = BigDecimal.ZERO;

	@Column(name = "overdue_limit")
	private Integer overdueLimit = 0;
}
