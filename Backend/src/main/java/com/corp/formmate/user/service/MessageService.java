package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 메세지 발송 서비스
 * 카카오톡 알림톡과 SMS 발송을 통합 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final KakaoMessageSender kakaoMessageSender;
    private final SmsMessageSender smsMessageSender;

    /**
     * 인증 코드를 포함한 메세지를 발송
     * 먼저 카카오톡 알림톡을 시도, 실패 시 SMS로 전송
     *
     * @param phoneNumber 수신자 전화번호
     * @param code 인증코드
     * @param preferKakao 카카오톡 메세지 우선 발송 여부
     * @return 발송 성공 여부
     */
    public boolean sendVerificationCode(String phoneNumber, String code, boolean preferKakao) {
        // 전화번호 형식 검증
        if (!isValidPhoneNumber(phoneNumber)) {
            log.error("Invalid phone number format: {}", phoneNumber);
            return false;
        }

        if (preferKakao) {
            // 카카오톡 메세지 시도
            boolean kakaoSuccess = kakaoMessageSender.sendVerificationCode(phoneNumber, code);
            if (kakaoSuccess) {
                return true;
            }
            log.info("Kakao message failed, falling back to SMS for {}", phoneNumber);
        }

        // 카카오톡 실패 또는 SMS 선호 시 SMS 발송
        return smsMessageSender.sendVerificationCode(phoneNumber, code);
    }

    /**
     * 전화번호 형식 검증
     * @param phoneNumber 검증할 전화번호
     * @return 유효성 여부
     */
    private boolean isValidPhoneNumber(String phoneNumber) {
        // 한국 전화번호 형식 검증 (010-xxxx-xxxx 또는 010xxxxxxxx)
        return phoneNumber != null &&
                (phoneNumber.matches("^010-\\d{4}-\\d{4}$") ||
                        phoneNumber.matches("^010\\d{8}$"));
    }

    /**
     * 전화번호 형식 통일 (하이픈 제거)
     * @param phoneNumber 원본 전화번호
     * @return 정규화된 전화번호
     */
    public String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }
        return phoneNumber.replaceAll("-", "");
    }
}
