package com.corp.formmate.chat.entity;

import java.time.LocalDateTime;

import com.corp.formmate.contract.entity.ContractEntity;
import com.corp.formmate.user.entity.UserEntity;

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
@Table(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// FK: contract_id -> contracts.id
	@ManyToOne
	@JoinColumn(name = "contract_id", nullable = false)
	private ContractEntity contract;

	// FK: writer_id -> users.id
	@ManyToOne
	@JoinColumn(name = "writer_id", nullable = false)
	private UserEntity writer;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	@Column(name = "is_read", nullable = false)
	private boolean isRead = false;

	@Column(name = "is_deleted", nullable = false)
	private boolean isDeleted = false;

	@Column(name = "created_at", nullable = false,
		columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
	private LocalDateTime createdAt;
}