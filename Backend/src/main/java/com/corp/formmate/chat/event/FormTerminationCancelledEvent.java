package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * 계약 파기 취소 이벤트
 */
@Getter
public class FormTerminationCancelledEvent{

    private final FormEntity formEntity;
    private final Integer requestedByUserId;

    public FormTerminationCancelledEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
