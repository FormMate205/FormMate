package com.corp.formmate.contract.entity;

import java.io.Serializable;
import java.time.LocalDate;

import com.corp.formmate.form.entity.FormEntity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	// 연체 횟수(누적)
	@Column(name = "overdue_count", nullable = false)
	@Builder.Default
	private Integer overdueCount = 0;

	// 연체 금액(현재)
	@Column(name = "overdue_amount", nullable = false)
	@Builder.Default
	private Long overdueAmount = 0L;

	// 다음 상환 날짜
	@Column(name = "next_repayment_date", nullable = false)
	private LocalDate nextRepaymentDate;

	// 중도 상환 횟수
	@Column(name = "early_repayment_count", nullable = false)
	@Builder.Default
	private Integer earlyRepaymentCount = 0;

	// 총 중도 상환 금액(현재)
	@Column(name = "total_early_repayment_fee", nullable = false)
	@Builder.Default
	private Long totalEarlyRepaymentFee = 0L;

	// 잔여 원금
	@Column(name = "remaining_principal")
	private Long remainingPrincipal;

	// 잔여 원금에서 연체 금액을 뺀 금액
	@Column(name = "remaining_principal_minus_overdue")
	private Long remainingPrincipalMinusOverdue;

	// 이자 금액(낸 이자, 누적)
	@Column(name = "interest_amount", nullable = false)
	@Builder.Default
	private Long interestAmount = 0L;

	// 연체 이자 금액(낸이자, 누적)
	@Column(name = "overdue_interest_amount", nullable = false)
	@Builder.Default
	private Long overdueInterestAmount = 0L;

	// 만기일 예상 납부 금액
	@Column(name = "expected_maturity_payment", nullable = false)
	private Long expectedMaturityPayment;

	// 만기일 예상 납부 이자
	@Column(name = "expected_interest_amount_at_maturity", nullable = false)
	private Long expectedInterestAmountAtMaturity;

	// 현재 회차
	@Column(name = "current_payment_round", nullable = false)
	@Builder.Default
	private Integer currentPaymentRound = 1;

	public void addToTotalEarlyRepaymentFee(long fee) {
		if (this.totalEarlyRepaymentFee == null) {
			this.totalEarlyRepaymentFee = 0L;
		}
		this.totalEarlyRepaymentFee += fee;
	}

}