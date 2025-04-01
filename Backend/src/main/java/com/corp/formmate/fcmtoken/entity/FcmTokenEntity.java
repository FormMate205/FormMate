package com.corp.formmate.fcmtoken.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.corp.formmate.user.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fcm_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FcmTokenEntity implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// 🔗 user_id 외래키 연결
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private UserEntity user;

	@Column(nullable = false, length = 255)
	private String token;

	@Column(name = "last_updated", nullable = false,
		columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
	private LocalDateTime lastUpdated;

	@Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
	private boolean active = true;

	public static FcmTokenEntity of(UserEntity userEntity, String token) {
		return FcmTokenEntity.builder()
			.user(userEntity)
			.token(token)
			.build();
	}

	// 상태 업데이트 메서드
	public void activate() {
		this.active = true;
	}

	public void deactivate() {
		this.active = false;
	}

	public void updateToken(String newToken) {
		this.token = newToken;
	}
}