package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * NAVER Cloud SENS API를 사용하여 SMS 및 알림톡을 발송하는 서비르
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NaverCloudSensSender implements MessageSender{

    private final RestTemplate restTemplate;

    @Value("${naver.cloud.sens.accessKey}")
    private String accessKey;

    @Value("${naver.cloud.sens.secretKey}")
    private String secretKey;

    @Value("${naver.cloud.sens.serviceId}")
    private String serviceId;

    @Value("${naver.cloud.sens.senderPhone}")
    private String senderPhone;

    @Value("${naver.cloud.sens.smsUrl}")
    private String smsUrl;

    @Value("${naver.cloud.sens.alimtalkUrl}")
    private String alimtalkUrl;

    @Value("${naver.cloud.sens.kakaoSenderId}")
    private String kakaoSenderId;

    @Value("${naver.cloud.sens.kakaoTemplateCode}")
    private String kakaoTemplateCode;

    @Override
    public boolean sendVerificationCode(String phoneNumber, String code, Boolean useAlimtalk) {
        if (useAlimtalk) {
            boolean alimtalkResult = sendAlimtalk(phoneNumber, code);
            if (alimtalkResult) {
                return true;
            }
            log.info("Alimtalk failed, falling back to SMS for {}", phoneNumber);
        }

        return sendSms(phoneNumber, code);
    }

    /**
     * SMS 발송 메서드
     */
    private boolean sendSms(String phoneNumber, String code) {
        try {
            String url = String.format("%s/services/%s/messages", smsUrl, serviceId);

            // 현재 시간을 기반으로 한 타임스탬프
            String timestamp = String.valueOf(System.currentTimeMillis());

            // 헤더 생성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-ncp-apigw-timestamp", timestamp);
            headers.set("x-ncp-iam-access-key", accessKey);
            headers.set("x-ncp-apigw-signature-v2", makeSignature("POST", url, timestamp, accessKey, secretKey));

            // 요청 본문 생성
            JSONObject requestBody = new JSONObject();
            requestBody.put("type", "SMS");
            requestBody.put("from", senderPhone);
            requestBody.put("content", String.format("[폼메이트] 인증번호 %s를 입력해주세요. 본인 확인을 위해 전송된 메시지입니다.", code));

            JSONArray messages =  new JSONArray();
            JSONObject message = new JSONObject();
            message.put("to", phoneNumber);
            messages.put(message);

            requestBody.put("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            // API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("SMS verification message sent successfully to {}", phoneNumber);
                return true;
            } else {
                log.info("Failed to send SMS: {}", response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.error("Error sending SMS verification message", e);
            return false;
        }
    }

    /**
     * 카카오 알림톡을 발송하는 메서드
     */
    private boolean sendAlimtalk(String phoneNumber, String code) {
        try {
            String url = String.format("%s/services/%s/messages", alimtalkUrl, serviceId);

            // 현재 시간을 기반으로 한 타임스탬프
            String timestamp = String.valueOf(System.currentTimeMillis());

            // 헤더 생성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-ncp-apigw-timestamp", timestamp);
            headers.set("x-ncp-iam-access-key", accessKey);
            headers.set("x-ncp-apigw-signature-v2", makeSignature("POST", url, timestamp, accessKey, secretKey));

            // 요청 본문 생성
            JSONObject requestBody = new JSONObject();
            requestBody.put("plusFriendId", kakaoSenderId);
            requestBody.put("templateCode", kakaoTemplateCode);

            JSONArray messages = new JSONArray();
            JSONObject message = new JSONObject();
            message.put("to", phoneNumber);

            // 카카오 알림톡 템플릿 파라미터
            JSONObject templateParams = new JSONObject();
            templateParams.put("code", code);
            message.put("templateParameters", templateParams);

            messages.put(message);
            requestBody.put("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            // API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Alimtalk message sent successfully to {}", phoneNumber);
                return true;
            } else {
                log.error("Failed to send Alimtalk: {}", response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.error("Error sending Alimtalk verification message", e);
            return false;
        }
    }

    /**
     * NAVER Cloud API 서명 생성
     */
    private String  makeSignature(String method,String url, String timestamp, String accessKey, String secretKey) throws NoSuchAlgorithmException, InvalidKeyException {
        String space = " ";
        String newLine = "\n";

        String message = new StringBuilder()
                .append(method)
                .append(space)
                .append(url)
                .append(newLine)
                .append(timestamp)
                .append(newLine)
                .append(accessKey)
                .toString();

        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(signingKey);

        byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(rawHmac);
    }
}
