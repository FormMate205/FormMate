package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 계약서 생성 이벤트
 */
@Getter
public class FormCreatedEvent {
    private final FormEntity formEntity;
    private final Integer requestedByUserId;

    public FormCreatedEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
