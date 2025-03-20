package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

/**
 * SMS 발송 서비스 구현체
 * 국내 SMS 서비스 업체 API 연동
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SmsMessageSender implements MessageSender {

    private final RestTemplate restTemplate;

    @Value("${sms.api.key}")
    private String apiKey;

    @Value("${sms.api-secret}")
    private String apiSecret;

    @Value("${sms.sender-number}")
    private String senderNumber;

    @Value("${sms.api-url}")
    private String apiUrl;

    @Override
    public boolean sendVerificationCode(String phoneNumber, String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", apiKey);
            headers.set("X-API-SECRET", apiSecret);

            // sms API 요청 본문 구성
            JSONObject requestBody = new JSONObject();
            requestBody.put("from", senderNumber);
            requestBody.put("to", phoneNumber);
            requestBody.put("content", String.format("[폼메이트] 인증번호 %s를 입력해주세요. 본인 확인을 위해 전송된 메세지 입니다.", code));

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            // API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("SMS verification message sent successfully to {}", phoneNumber);
                return true;
            } else {
                log.error("Failed to send SMS verification message: {}", response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("Error sending SMS verification message", e);
            return false;
        }
    }
}
