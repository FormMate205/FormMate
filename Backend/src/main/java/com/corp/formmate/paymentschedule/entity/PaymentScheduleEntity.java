package com.corp.formmate.paymentschedule.entity;

import java.time.LocalDateTime;

import com.corp.formmate.contract.entity.ContractEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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

@Entity
@Table(name = "payment_schedule")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentScheduleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; // 고유 식별자 (납부 스케줄 ID)

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "contract_id", nullable = false)
	private ContractEntity contract; // 연결된 계약 ID (contracts 테이블 참조)

	@Column(name = "payment_round", nullable = false)
	private Integer paymentRound; // 회차 번호 (예: 1회차, 2회차)

	@Column(name = "scheduled_payment_date", nullable = false)
	private LocalDateTime scheduledPaymentDate; // 예정 납부일

	@Column(name = "scheduled_principal", nullable = false)
	private Long scheduledPrincipal; // 예정 원금

	@Column(name = "scheduled_interest", nullable = false)
	private Long scheduledInterest; // 예정 이자

	@Column(name = "overdue_amount", nullable = false)
	private Long overdueAmount; // 연체 이자 (해당 회차 기준)

	@Column(name = "early_repayment_fee", nullable = false)
	private Long earlyRepaymentFee; // 중도상환 수수료

	@Column(name = "actual_paid_amount")
	private Long actualPaidAmount; // 실제 납부된 금액

	@Column(name = "actual_paid_date")
	private LocalDateTime actualPaidDate; // 실제 납부된 날짜

	@Column(name = "is_paid")
	private Boolean isPaid; // 납부 여부 (true: 납부 완료, false: 미납)

	@Column(name = "is_overdue")
	private Boolean isOverdue; // 연체 여부 (true: 연체, false: 정상)

	@Column(name = "updated_at")
	private LocalDateTime updatedAt; // 마지막 수정 시각
}