package com.corp.formmate.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.user.entity.UserEntity;

@Entity
@Table(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	// writer_id -> User
	@ManyToOne
	@JoinColumn(name = "writer_id", nullable = false)
	private UserEntity writer;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	@Column(name = "is_read", nullable = false)
	private Boolean isRead = false;

	@Column(name = "is_deleted", nullable = false)
	private Boolean isDeleted = false;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
}