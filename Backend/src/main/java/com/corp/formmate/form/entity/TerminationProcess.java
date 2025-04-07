package com.corp.formmate.form.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TerminationProcess {
    NONE("정상"),
    REQUESTED("신청"),
    SIGNED("상대방 서명");

    private final String korName;

    public static TerminationProcess fromKorName(String korName) {
        for (TerminationProcess process : TerminationProcess.values()) {
            if (process.getKorName().equals(korName)) {
                return process;
            }
        }
        throw new IllegalArgumentException("일치하는 상태값이 없습니다: " + korName);
    }
}
