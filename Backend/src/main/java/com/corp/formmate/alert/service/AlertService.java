package com.corp.formmate.alert.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.alert.dto.AlertCountResponse;
import com.corp.formmate.alert.dto.AlertListResponse;
import com.corp.formmate.alert.entity.AlertEntity;
import com.corp.formmate.alert.repository.AlertRepository;
import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.AlertException;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class AlertService {

	private final AlertRepository alertRepository;

	private final FcmTokenService fcmTokenService;

	private final UserService userService;

	@Transactional(readOnly = true)
	public List<AlertListResponse> selectUnreadAlerts(Integer userId) {
		UserEntity userEntity = userService.selectById(userId);
		List<AlertEntity> alertEntities = alertRepository.findByUserAndIsDeletedFalseAndIsReadFalseOrderByCreatedAtDesc(
			userEntity);
		return alertEntities.stream()
			.map(AlertListResponse::fromEntity)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public Page<AlertListResponse> selectAlerts(Integer userId, Integer alertId, Pageable pageable) {
		UserEntity userEntity = userService.selectById(userId);
		Page<AlertEntity> alertEntities;
		if (alertId == null) {
			alertEntities = alertRepository.findByUserAndIsDeletedFalseOrderByIdDesc(userEntity, pageable);
		} else {
			alertEntities = alertRepository.findOlderAlertsById(userEntity, alertId, pageable);
		}
		return alertEntities.map(AlertListResponse::fromEntity);
	}

	@Transactional
	public boolean updateUnreadAlerts(Integer userId) {
		UserEntity userEntity = userService.selectById(userId);
		alertRepository.markAllAsRead(userEntity);
		return true;
	}

	@Transactional
	public boolean deleteAlert(Integer userId, Integer alertId) {
		UserEntity userEntity = userService.selectById(userId);
		AlertEntity alertEntity = selectById(alertId);
		if (userEntity != alertEntity.getUser()) {
			throw new AlertException(ErrorCode.UNAUTHORIZED);
		}
		alertEntity.delete();
		alertRepository.save(alertEntity);
		return true;
	}

	@Transactional(readOnly = true)
	public AlertEntity selectById(Integer alertId) {
		if (alertId == null) {
			throw new AlertException(ErrorCode.INVALID_INPUT_VALUE);
		}
		AlertEntity alertEntity = alertRepository.findById(alertId).orElse(null);
		if (alertEntity == null) {
			throw new AlertException(ErrorCode.NOTIFICATION_NOT_FOUND);
		}
		return alertEntity;
	}

	@Transactional(readOnly = true)
	public AlertCountResponse countUnreadAlerts(Integer userId) {
		UserEntity userEntity = userService.selectById(userId);
		Long count = alertRepository.countByUserAndIsDeletedFalseAndIsReadFalse(userEntity);
		return AlertCountResponse.builder()
			.unreadAlertCount(count)
			.build();
	}

	@Transactional
	public void createAlert(UserEntity userEntity, String alertType, String title, String content) {
		AlertEntity alertEntity = AlertEntity.builder()
			.user(userEntity)
			.alertType(alertType)
			.title(title)
			.content(content)
			.build();

		alertRepository.save(alertEntity);
		fcmTokenService.sendMessageTo(userEntity, title, content);
	}
}
