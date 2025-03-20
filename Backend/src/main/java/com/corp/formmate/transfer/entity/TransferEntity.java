package com.corp.formmate.transfer.entity;

import java.time.LocalDateTime;

import com.corp.formmate.contract.entity.ContractEntity;
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
@Table(name = "transfers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// FK: contract_id -> contracts.id
	@ManyToOne
	@JoinColumn(name = "contract_id", nullable = false)
	private ContractEntity contract;

	// FK: sender_id -> users.id
	@ManyToOne
	@JoinColumn(name = "sender_id", nullable = false)
	private UserEntity sender;

	// FK: receiver_id -> users.id
	@ManyToOne
	@JoinColumn(name = "receiver_id", nullable = false)
	private UserEntity receiver;

	@Column(nullable = false)
	private Long amount;

	@Column(name = "current_round", nullable = false)
	private Integer currentRound;

	@Column(name = "payment_difference", nullable = false)
	private Long paymentDifference = 0L;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransferStatus status; // '연체','납부','중도상환'

	@Column(name = "transaction_date", nullable = false)
	private LocalDateTime transactionDate;
}