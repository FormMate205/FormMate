package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

@Getter
public class CreditorSignatureRequestedEvent {
    private FormEntity formEntity;
    private Integer requestedByUserId;

    public CreditorSignatureRequestedEvent(FormEntity formEntity, Integer requestedByUserId) {
        this.formEntity = formEntity;
        this.requestedByUserId = requestedByUserId;
    }
}
