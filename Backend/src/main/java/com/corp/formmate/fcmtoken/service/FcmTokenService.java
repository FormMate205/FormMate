package com.corp.formmate.fcmtoken.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.fcmtoken.dto.FcmTokenCreateRequest;
import com.corp.formmate.fcmtoken.entity.FcmTokenEntity;
import com.corp.formmate.fcmtoken.repository.FcmTokenRepository;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FcmTokenException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
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

	private final UserService userService;

	public void sendMessageTo(String fcmToken, String title, String body) {
		Message message = Message.builder()
			.setToken(fcmToken)
			.setNotification(Notification.builder()
				.setTitle(title)
				.setBody(body)
				.build())
			.build();

		try {
			String response = FirebaseMessaging.getInstance().send(message);
			System.out.println("✅ 푸시 전송 성공: " + response);
		} catch (FirebaseMessagingException e) {
			System.err.println("❌ 푸시 전송 실패: " + e.getMessage());
		}
	}

	@Transactional
	public boolean createToken(Integer userId, @Valid FcmTokenCreateRequest fcmTokenCreateRequest) {
		String token = fcmTokenCreateRequest.getToken();
		if (token == null) {
			throw new FcmTokenException(ErrorCode.INVALID_FCM_TOKEN);
		}
		UserEntity userEntity = userService.selectById(userId);
		FcmTokenEntity fcmTokenEntity = FcmTokenEntity.of(userEntity, token);
		fcmTokenRepository.save(fcmTokenEntity);
		return true;
	}

	@Transactional
	public boolean deleteToken(Integer userId) {
		FcmTokenEntity fcmTokenEntity = selectByUser(userId);
		fcmTokenRepository.delete(fcmTokenEntity);
		return true;
	}

	@Transactional(readOnly = true)
	public boolean existsToken(Integer userId) {
		UserEntity userEntity = userService.selectById(userId);
		return fcmTokenRepository.existsByUser(userEntity);
	}

	@Transactional(readOnly = true)
	public FcmTokenEntity selectByUser(Integer userId) {
		UserEntity userEntity = userService.selectById(userId);
		return fcmTokenRepository.findByUser(userEntity)
			.orElseThrow(() -> new FcmTokenException(ErrorCode.FCM_TOKEN_NOT_FOUND));
	}
}
