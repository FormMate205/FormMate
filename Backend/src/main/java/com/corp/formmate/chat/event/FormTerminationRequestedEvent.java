package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 계약 종료 요청 이벤트
 */
@Getter
public class FormTerminationRequestedEvent {
    private final FormEntity formEntity;
    private final Integer requestedByUserId;

    public FormTerminationRequestedEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
