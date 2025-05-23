package com.corp.formmate.chat.entity;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum MessageType {
    CHAT("일반 채팅"),
    CONTRACT_SHARED("계약서 공유"),
    SIGNATURE_REQUEST_CONTRACT("계약 체결 서명 요청"),
    SIGNATURE_REQUEST_TERMINATION("계약 파기 서명 요청"),
    SYSTEM_NOTIFICATION("시스템 알림");

    private final String description;

    MessageType(String description) {
        this.description = description;
    }
}
