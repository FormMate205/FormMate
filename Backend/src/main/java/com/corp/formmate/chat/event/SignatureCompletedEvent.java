package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 서명 완료 이벤트
 */
@Getter
public class SignatureCompletedEvent {
    private final FormEntity formEntity;

    public SignatureCompletedEvent(FormEntity formEntity) {
        this.formEntity = formEntity;
    }
}
