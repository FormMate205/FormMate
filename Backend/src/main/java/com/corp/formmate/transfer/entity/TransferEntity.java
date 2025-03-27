package com.corp.formmate.transfer.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.corp.formmate.form.entity.FormEntity;
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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "transfers")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	// sender_id -> User
	@ManyToOne
	@JoinColumn(name = "sender_id", nullable = false)
	private UserEntity sender;

	// receiver_id -> User
	@ManyToOne
	@JoinColumn(name = "receiver_id", nullable = false)
	private UserEntity receiver;

	@Column(nullable = false)
	private Long amount;

	@Column(name = "current_round", nullable = false)
	private Integer currentRound;

	@Column(name = "payment_difference", nullable = false)
	private Long paymentDifference = 0L;

	// status ENUM('OVERDUE','PAID','EARLY_REPAYMENT')
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransferStatus status;

	@Column(name = "transaction_date", nullable = false)
	private LocalDateTime transactionDate;
}