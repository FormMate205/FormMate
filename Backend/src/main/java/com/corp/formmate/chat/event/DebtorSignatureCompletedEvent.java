package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

@Getter
public class DebtorSignatureCompletedEvent {
    private final FormEntity formEntity;

    public DebtorSignatureCompletedEvent(FormEntity formEntity) {
        this.formEntity = formEntity;
    }
}
