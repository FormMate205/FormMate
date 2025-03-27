package com.corp.formmate.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 메세지 발송 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final CoolSMSSender coolSMSSender;

    /**
     * 인증 코드를 포함한 메세지를 발송
     *
     * @param phoneNumber 수신자 전화번호
     * @param code 인증코드
     * @return 발송 성공 여부
     */
    public boolean sendVerificationCode(String phoneNumber, String code) {
        // 전화번호 형식 검증
        if (!isValidPhoneNumber(phoneNumber)) {
            log.error("Invalid phone number format: {}", phoneNumber);
            return false;
        }

        try {
            // CoolSMS를 사용하여 메세지 전송
            return coolSMSSender.sendVerificationCode(phoneNumber, code);
        } catch (Exception e) {
            log.error("Failed to send verification code: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 은행 1원 송금 내역 알림
     * @param phoneNumber 수신자 전화번호
     * @param bankName 은행 이름
     * @param maskedAccountNumber 마스킹된 계좌번호
     * @param verifyString 인증코드
     * @return 발송 성공 여부
     */
    public boolean sendBankAnnouncement(String phoneNumber, String bankName, String maskedAccountNumber, String verifyString) {
        // 전화번호 형식 검증
        if (!isValidPhoneNumber(phoneNumber)) {
            log.error("Invalid phone number format: {}", phoneNumber);
            return false;
        }

        try {
            // CoolSMS를 사용하여 메세지 전송
            return coolSMSSender.sendAnnouncement(phoneNumber, bankName, maskedAccountNumber, verifyString);
        } catch (Exception e) {
            log.error("Failed to send announcement: {}", e.getMessage());
            return false;
        }
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
