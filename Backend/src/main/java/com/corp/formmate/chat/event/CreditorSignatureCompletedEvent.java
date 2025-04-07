package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

@Getter
public class CreditorSignatureCompletedEvent {
    private final FormEntity formEntity;

    public CreditorSignatureCompletedEvent(FormEntity formEntity) {
        this.formEntity = formEntity;
    }
}
