package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 서명 요청 이벤트
 */
@Getter
public class SignatureRequestEvent {
    private FormEntity formEntity;
    private Integer requestedByUserId;

    public SignatureRequestEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
