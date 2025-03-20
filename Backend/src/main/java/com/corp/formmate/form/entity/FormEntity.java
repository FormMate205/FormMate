package com.corp.formmate.form.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.corp.formmate.user.entity.UserEntity;

@Entity
@Table(name = "forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// status ENUM('상대승인전','상대승인후','진행중','연체','종료')
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private FormStatus status;

	// creator_id -> User
	@ManyToOne
	@JoinColumn(name = "creator_id", nullable = false)
	private UserEntity creator;

	// receiver_id -> User
	@ManyToOne
	@JoinColumn(name = "receiver_id", nullable = false)
	private UserEntity receiver;

	// creditor_id -> User
	@ManyToOne
	@JoinColumn(name = "creditor_id", nullable = false)
	private UserEntity creditor;

	// debtor_id -> User
	@ManyToOne
	@JoinColumn(name = "debtor_id", nullable = false)
	private UserEntity debtor;

	@Column(name = "creditor_name", nullable = false, length = 100)
	private String creditorName;

	@Column(name = "creditor_address", nullable = false, columnDefinition = "TEXT")
	private String creditorAddress;

	@Column(name = "creditor_phone", nullable = false, length = 20)
	private String creditorPhone;

	@Column(name = "creditor_bank", nullable = false, length = 50)
	private String creditorBank;

	@Column(name = "creditor_account", nullable = false, length = 50)
	private String creditorAccount;

	@Column(name = "debtor_name", nullable = false, length = 100)
	private String debtorName;

	@Column(name = "debtor_address", nullable = false, columnDefinition = "TEXT")
	private String debtorAddress;

	@Column(name = "debtor_phone", nullable = false, length = 20)
	private String debtorPhone;

	@Column(name = "debtor_bank", nullable = false, length = 50)
	private String debtorBank;

	@Column(name = "debtor_account", nullable = false, length = 50)
	private String debtorAccount;

	@Column(name = "contract_date", nullable = false)
	private LocalDate contractDate;

	@Column(name = "maturity_date", nullable = false)
	private LocalDate maturityDate;

	@Column(name = "loan_amount", nullable = false)
	private Long loanAmount;

	// repayment_method ENUM('원금균등상환','원리금균등상환','원금상환')
	@Enumerated(EnumType.STRING)
	@Column(name = "repayment_method", nullable = false)
	private RepaymentMethod repaymentMethod;

	@Column(name = "repayment_day", nullable = false)
	private Integer repaymentDay;

	@Column(name = "interest_rate", precision = 5, scale = 2)
	private BigDecimal interestRate;

	@Column(name = "early_repayment_fee_rate", precision = 5, scale = 2)
	private BigDecimal earlyRepaymentFeeRate;

	@Column(name = "overdue_interest_rate", precision = 5, scale = 2)
	private BigDecimal overdueInterestRate;

	@Column(name = "overdue_limit")
	private Integer overdueLimit;
}