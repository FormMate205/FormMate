package com.corp.formmate.user.service;

/**
 * 메세지 발송 서비스 인터페이스
 */
public interface MessageSender {

    /**
     * 인증코드를 포함한 메세지를 발송
     * @param phoneNumber 수신자 전화번호
     * @param code 인증코드
     * @param useAlimtalk 알림톡 사용 여부
     * @return 발송 성공 여부
     */
    boolean sendVerificationCode(String phoneNumber, String code, Boolean useAlimtalk);

    /**
     * 기본 메서드: 알림톡 사용하지 않음
     */
    default boolean sendVerificationCode(String phoneNumber, String code) {
        return sendVerificationCode(phoneNumber, code, false);
    }
}
