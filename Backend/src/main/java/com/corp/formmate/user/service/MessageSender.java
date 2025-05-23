package com.corp.formmate.user.service;

/**
 * 메세지 발송 서비스 인터페이스
 */
public interface MessageSender {

    /**
     * 전화번호 인증
     * 인증코드를 포함한 메세지를 발송
     * @param phoneNumber 수신자 전화번호
     * @param code 인증코드
     * @return 발송 성공 여부
     */
    boolean sendVerificationCode(String phoneNumber, String code);

    /**
     * 은행 송금 내역 알림
     * @param phoneNumber 수신자 전화번호
     * @param bankName 은행 이름
     * @param maskedAccountNumber 마스킹된 계좌번호
     * @param verifyString 인증코드
     * @return 발송 성공 여부
     */
    boolean sendAnnouncement(String phoneNumber, String bankName, String maskedAccountNumber, String verifyString);
}
