package com.corp.formmate.user.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    private DefaultMessageService messageService;

    @PostConstruct
    public void init() {
        // CoolSMS SDK 초기화
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecret, domain);
    }

    @Override
    public boolean sendVerificationCode(String phoneNumber, String code) {
        return sendPhoneVerificationCode(phoneNumber, code);
    }

    @Override
    public boolean sendAnnouncement(String phoneNumber, String bankName, String maskedAccountNumber, String verifyString) {
        return sendBankAnnouncement(phoneNumber, bankName, maskedAccountNumber, verifyString);
    }

    /**
     * 휴대전화 인증번호 발송 메서드
     */
    private boolean sendPhoneVerificationCode(String phoneNumber, String code) {
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
     * 은행 입금내역 알림 발송
     */
    private boolean sendBankAnnouncement(String phoneNumber, String bankName, String maskedAccountNumber, String verifyString) {
        try {
            LocalDateTime now = LocalDateTime.now();
            String currentDate = now.format(DateTimeFormatter.ofPattern("MM/dd"));
            String currentTime = now.format(DateTimeFormatter.ofPattern("HH:mm"));

            Message message = new Message();
            message.setFrom(senderPhone);
            message.setTo(phoneNumber);
            message.setText(String.format("%s %s %s\n%s\n입금 1원\n인증번호 전송 %s",
                    bankName,                      // 은행 이름 (예: "OO")
                    currentDate,                  // 현재 날짜 (예: "06/14")
                    currentTime,                  // 현재 시간 (예: "12:16")
                    maskedAccountNumber,          // 마스킹된 계좌번호 (예: "110-***-123456")
                    verifyString));                       // 인증번호

            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            log.info("Bank Code sent successfully: {}", response);
            return true;

        } catch (Exception e) {
            log.error("Failed to send Back Code: {}", e.getMessage());
            return false;
        }
    }
}
