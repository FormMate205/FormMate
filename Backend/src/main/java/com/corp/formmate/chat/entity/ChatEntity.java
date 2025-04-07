package com.corp.formmate.chat.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.corp.formmate.chat.dto.ChatResponse;
import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.global.constants.SystemConstants;
import com.corp.formmate.user.entity.UserEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chats")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// form_id -> Form
	@ManyToOne
	@JoinColumn(name = "form_id", nullable = false)
	private FormEntity form;

	// writer_id -> User
	@ManyToOne
	@JoinColumn(name = "writer_id", nullable = false) // 시스템일 경우 null 허용
	private UserEntity writer;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	@Column(name = "is_read", nullable = false)
	@Builder.Default
	private Boolean isRead = false;

	@Column(name = "is_deleted", nullable = false)
	@Builder.Default
	private Boolean isDeleted = false;

	@Column(name = "created_at", nullable = false)
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	@Enumerated(EnumType.STRING)  // VARCHAR로 저장하도록 지정
	@Column(name = "message_type")
	@Builder.Default
	private MessageType messageType = MessageType.CHAT;  // 기본값 설정

	@Column(name = "target_user_id", nullable = true)
	private Integer targetUserId;

	// 시스템 메세지인지 확인
	public boolean isSystemMessage() {
		return writer != null && writer.getId().equals(SystemConstants.SYSTEM_USER_ID); // Id가 0인 사용자가 시스템
	}
}