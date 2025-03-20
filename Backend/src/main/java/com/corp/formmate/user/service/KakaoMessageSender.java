package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * 카카오 알림톡 발송 서비스 구현체
 * 카카오 비즈 API 연동
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoMessageSender implements MessageSender {
    private final RestTemplate restTemplate;

    @Value("${kakao.biz.api-key}")
    private String apiKey;

    @Value("${kakao.biz.sender-key}")
    private String senderKey;

    @Value("${kakao.biz.template-code}")
    private String templateCode;

    @Value("${kakao.biz.api-url}")
    private String apiUrl;

    @Override
    public boolean sendVerificationCode(String phoneNumber, String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            // 카카오 비즈 API 요청 본문 구성
            JSONObject requestBody = new JSONObject();
            requestBody.put("senderKey", senderKey);
            requestBody.put("templateCode", templateCode);
            requestBody.put("phoneNumber", phoneNumber);

            // 템블릿에 맞게 변수 설정
            JSONObject templateData = new JSONObject();
            templateData.put("code", code);
            requestBody.put("templateData", templateData.toString());

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            // API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("SMS verification message sent successfully to {}", phoneNumber);
                return true;
            } else {
                log.error("Failed to send Kakao verification message: {}", response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("Error sending SMS verification message", e);
            return false;
        }
    }
}
