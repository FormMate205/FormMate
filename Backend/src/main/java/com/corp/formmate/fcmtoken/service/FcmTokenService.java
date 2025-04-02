package com.corp.formmate.fcmtoken.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.fcmtoken.dto.FcmTokenRequest;
import com.corp.formmate.fcmtoken.entity.FcmTokenEntity;
import com.corp.formmate.fcmtoken.repository.FcmTokenRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FcmTokenException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FcmTokenService {

	private final FcmTokenRepository fcmTokenRepository;

	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public void sendMessageTo(UserEntity userEntity, String title, String body) {
		FcmTokenEntity fcmTokenEntity = checkTokenByUser(userEntity);

		if (fcmTokenEntity == null) {
			return;
		}

		Message message = Message.builder()
			.setToken(fcmTokenEntity.getToken())
			.setNotification(Notification.builder()
				.setTitle(title)
				.setBody(body)
				.setImage("https://github.com/user-attachments/assets/28da961d-3ab9-4650-b214-7a89125c4478")
				.build())
			.build();

		try {
			String response = FirebaseMessaging.getInstance().send(message);
			System.out.println("✅ 푸시 전송 성공: " + response);
		} catch (FirebaseMessagingException e) {
			System.err.println("❌ 푸시 전송 실패: " + e.getMessage());
		}
	}

	@Transactional(readOnly = true)
	public void sendTestMessageTo(@Valid FcmTokenRequest tokenRequest, String title, String body) {

		Message message = Message.builder()
			.setToken(tokenRequest.getToken())
			.setNotification(Notification.builder()
				.setTitle(title)
				.setBody(body)
				.setImage("https://github.com/user-attachments/assets/28da961d-3ab9-4650-b214-7a89125c4478")
				.build())
			.build();

		try {
			String response = FirebaseMessaging.getInstance().send(message);
			System.out.println("✅ 푸시 전송 성공: " + response);
		} catch (FirebaseMessagingException e) {
			System.err.println("❌ 푸시 전송 실패: " + e.getMessage());
		}
	}

	// 알림 설정 토글 OFF -> ON token 발급해서 던져줘야함
	@Transactional
	public boolean activateToken(Integer userId, @Valid FcmTokenRequest fcmTokenRequest) {
		String token = fcmTokenRequest.getToken();
		if (token == null) {
			throw new FcmTokenException(ErrorCode.INVALID_FCM_TOKEN);
		}
		FcmTokenEntity fcmTokenEntity = selectByUser(userId);
		fcmTokenEntity.activate(token);
		fcmTokenRepository.save(fcmTokenEntity);
		return true;
	}

	@Transactional
	public boolean refreshToken(Integer userId, @Valid FcmTokenRequest fcmTokenRequest) {
		FcmTokenEntity fcmTokenEntity = selectByUser(userId);
		if (!fcmTokenEntity.isActive()) {
			return true;
		}
		String token = fcmTokenRequest.getToken();
		if (token == null) {
			throw new FcmTokenException(ErrorCode.INVALID_FCM_TOKEN);
		}
		fcmTokenEntity.updateToken(token);
		fcmTokenRepository.save(fcmTokenEntity);
		return true;
	}

	// 알림 설정 토글 ON -> OFF
	@Transactional
	public boolean deactivateToken(Integer userId) {
		FcmTokenEntity fcmTokenEntity = selectByUser(userId);
		fcmTokenEntity.deactivate();
		fcmTokenRepository.save(fcmTokenEntity);
		return true;
	}

	// 알림 설정이 되어있는지 되어있지 않은지 여부 확인
	@Transactional(readOnly = true)
	public boolean isActiveToken(Integer userId) {
		UserEntity userEntity = selectUserById(userId);
		return fcmTokenRepository.existsByUserAndActiveTrue(userEntity);
	}

	// userId 로 FcmToken 검색
	@Transactional(readOnly = true)
	protected FcmTokenEntity selectByUser(Integer userId) {
		UserEntity userEntity = selectUserById(userId);
		return fcmTokenRepository.findByUser(userEntity)
			.orElseThrow(() -> new FcmTokenException(ErrorCode.FCM_TOKEN_NOT_FOUND));
	}

	// 알림 설정 여부, 로그인 여부 확인 하여 FcmToken 반환
	@Transactional(readOnly = true)
	protected FcmTokenEntity checkTokenByUser(UserEntity userEntity) {
		if (!userEntity.isLogged()) {
			return null;
		}
		return fcmTokenRepository.findByUser(userEntity).orElse(null);
	}

	// 회원가입 할때만 가져다가 사용할 로직
	@Transactional
	public void register(UserEntity userEntity) {
		FcmTokenEntity fcmTokenEntity = FcmTokenEntity.builder()
			.user(userEntity)
			.token("알림설정")
			.build();
		fcmTokenRepository.save(fcmTokenEntity);
	}

	// 순환 오류로 인해 user 찾기 메서드 따로 생성
	@Transactional(readOnly = true)
	protected UserEntity selectUserById(Integer userId) {
		if (userId == null) {
			throw new UserException(ErrorCode.USER_NOT_FOUND);
		}
		return userRepository.findById(userId)
			.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
	}
}
