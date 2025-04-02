package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

/**
 * 계약서 수정 이벤트
 */
@Getter
public class FormUpdatedEvent {
    private  final FormEntity formEntity;

    public FormUpdatedEvent(FormEntity formEntity) {
        this.formEntity = formEntity;
    }
}
