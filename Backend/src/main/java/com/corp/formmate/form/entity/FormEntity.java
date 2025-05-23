package com.corp.formmate.form.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.corp.formmate.form.dto.FormUpdateRequest;
import com.corp.formmate.user.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
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
@Table(name = "forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

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
	private LocalDateTime contractDate;

	@Column(name = "maturity_date", nullable = false)
	private LocalDateTime maturityDate;

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

	// 계약 파기 프로세스 여부를 관리하는 새로운 필드
	@Enumerated(EnumType.STRING)
	@Column(name = "is_termination_process", nullable = false)
	@Builder.Default
	private TerminationProcess isTerminationProcess = TerminationProcess.NONE;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "termination_requested_id", foreignKey = @ForeignKey(name = "fk_forms_termination_requested_user"))
	private UserEntity terminationRequestedUser;

	public void update(FormUpdateRequest request) {

		Integer repaymentDay = request.getRepaymentDay();
		Integer overdueLimit = request.getOverdueLimit();
		if (repaymentDay == null || repaymentDay < 0) {
			repaymentDay = 0;
		}
		if (overdueLimit == null || overdueLimit < 0) {
			overdueLimit = 0;
		}

		this.creditorName = request.getCreditorName();
		this.creditorAddress = request.getCreditorAddress();
		this.creditorPhone = request.getCreditorPhone();
		this.creditorBank = request.getCreditorBank();
		this.creditorAccount = request.getCreditorAccount();

		this.debtorName = request.getDebtorName();
		this.debtorAddress = request.getDebtorAddress();
		this.debtorPhone = request.getDebtorPhone();
		this.debtorBank = request.getDebtorBank();
		this.debtorAccount = request.getDebtorAccount();

		this.contractDate = request.getContractDate();
		this.maturityDate = request.getMaturityDate();
		this.loanAmount = request.getLoanAmount();
		this.repaymentMethod = RepaymentMethod.fromKorName(request.getRepaymentMethod());
		this.repaymentDay = repaymentDay;
		this.interestRate = request.getInterestRateAsBigDecimal();
		this.earlyRepaymentFeeRate = request.getEarlyRepaymentFeeRateAsBigDecimal();
		this.overdueInterestRate = request.getOverdueInterestRateAsBigDecimal();
		this.overdueLimit = overdueLimit;
	}

	// 파기 프로세스 시작
	public void startTerminationProcess() {
		this.isTerminationProcess = TerminationProcess.REQUESTED;
	}

	// 파기 프로세스 상대 서명 완료
	public void signTerminationProcess() {
		this.isTerminationProcess = TerminationProcess.SIGNED;
	}

	// 파기 프로세스 취소
	public void cancelTerminationProcess() {
		this.isTerminationProcess = TerminationProcess.NONE;
		this.terminationRequestedUser = null;
	}

	public void updateStatus(FormStatus status) {
		this.status = status;
	}

	public void updateTerminationRequestedUser(UserEntity terminationRequestedUser) {
		this.terminationRequestedUser = terminationRequestedUser;
	}
}