package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 계약 종료 완료 이벤트
 */
@Getter
public class FormTerminationCompletedEvent {
    private final FormEntity formEntity;

    public FormTerminationCompletedEvent(FormEntity formEntity) {
        this.formEntity = formEntity;
    }
}
