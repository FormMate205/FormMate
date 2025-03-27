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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contracts")
@Data
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

	@Column(name = "overdue_count", nullable = false)
	@Builder.Default
	private Integer overdueCount = 0;

	@Column(name = "overdue_amount", nullable = false)
	@Builder.Default
	private Long overdueAmount = 0L;

	@Column(name = "next_repayment_date", nullable = false)
	private LocalDate nextRepaymentDate;

	@Column(name = "early_repayment_count", nullable = false)
	@Builder.Default
	private Integer earlyRepaymentCount = 0;

	@Column(name = "total_early_repayment_fee", nullable = false)
	@Builder.Default
	private Long totalEarlyRepaymentFee = 0L;

	@Column(name = "remaining_principal")
	private Long remainingPrincipal;

	@Column(name = "remaining_principal_minus_overdue")
	private Long remainingPrincipalMinusOverdue;

	@Column(name = "interest_amount", nullable = false)
	@Builder.Default
	private Long interestAmount = 0L;

	@Column(name = "overdue_interest_amount", nullable = false)
	@Builder.Default
	private Long overdueInterestAmount = 0L;

	@Column(name = "expected_maturity_payment", nullable = false)
	private Long expectedMaturityPayment;

	@Column(name = "expected_interest_amount_at_maturity", nullable = false)
	private Long expectedInterestAmountAtMaturity;

	@Column(name = "current_payment_round", nullable = false)
	@Builder.Default
	private Integer currentPaymentRound = 1;
}