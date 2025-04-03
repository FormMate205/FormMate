package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 계약서 수정 이벤트
 */
@Getter
public class FormUpdatedEvent {
    private  final FormEntity formEntity;
    private final Integer requestedByUserId;

    public FormUpdatedEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
