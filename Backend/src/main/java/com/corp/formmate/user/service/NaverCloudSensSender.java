package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * NAVER Cloud SENS API를 사용하여 SMS 및 알림톡을 발송하는 서비르
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NaverCloudSensSender implements MessageSender{

    private final RestTemplate restTemplate;

    @Value("")

    @Override
    public boolean sendVerificationCode(String phoneNumber, String code) {
        return false;
    }
}
