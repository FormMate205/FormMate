package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

@Getter
public class FirstPartyTerminationSignedEvent {
    private final FormEntity formEntity;
    private final Integer requestedByUserId;

    public FirstPartyTerminationSignedEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
