package com.corp.formmate.user.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.KakaoOption;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * CoolSMS API를 사용하여 SMS 및 알림톡을 발송하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CoolSMSSender implements MessageSender {

    @Value("${coolsms.api.key}")
    private String apiKey;

    @Value("${coolsms.api.secret}")
    private String apiSecret;

    @Value("${coolsms.sender.phone}")
    private String senderPhone;

    @Value("${coolsms.sender.domain}")
    private String domain;

    @Value("${coolsms.kakao.pfid}")
    private String kakaoSenderId;

    @Value("${coolsms.kakao.template-code}")
    private String kakaoTemplateCode;

    private DefaultMessageService messageService;

    @PostConstruct
    public void init() {
        // CoolSMS SDK 초기화
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, domain);
    }

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
            Message message = new Message();
            message.setFrom(senderPhone);
            message.setTo(phoneNumber);
            message.setText(String.format("[폼메이트] 인증번호 %s를 입력해주세요. 본인 확인을 위해 전송된 메시지입니다.", code));

            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            log.info("SMS sent successfully: {}", response);
            return true;

        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 카카오 알림톡을 발송하는 메서드
     */
    private boolean sendAlimtalk(String phoneNumber, String code) {
        try {
            Message message = new Message();
            message.setFrom(senderPhone);
            message.setTo(phoneNumber);
            message.setText(String.format("[폼메이트] 인증번호 %s를 입력해주세요. 본인 확인을 위해 전송된 메시지입니다.", code));

            // 알림톡 설정
            KakaoOption kakaoOption = new KakaoOption();
            kakaoOption.setPfId(kakaoSenderId);
            kakaoOption.setTemplateId(kakaoTemplateCode);

            // 알림톡 타입 (기본 알림톡)
            kakaoOption.setDisableSms(false); // SMS로 대체발송 활성화

            // 템플릿 파라미터 설정
            Map<String, String> variables = new HashMap<>();
            variables.put("code", code);
            kakaoOption.setVariables(variables);

            message.setKakaoOptions(kakaoOption);

            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            log.info("Alimtalk sent successfully: {}", response);
            return true;
        } catch (Exception e) {
            log.error("Failed to send Alimtalk: {}", e.getMessage());
            return false;
        }
    }

}
