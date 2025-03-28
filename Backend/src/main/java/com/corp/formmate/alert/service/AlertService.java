package com.corp.formmate.alert.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.alert.dto.AlertUnreadResponse;
import com.corp.formmate.alert.repository.AlertRepository;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j

public class AlertService {

	private final AlertRepository alertRepository;

	private final UserService userService;

	@Transactional(readOnly = true)
	public Page<AlertUnreadResponse> selectUnreadAlerts(Integer userId, Pageable pageable) {
		UserEntity userEntity = userService.selectById(userId);
	}
}
