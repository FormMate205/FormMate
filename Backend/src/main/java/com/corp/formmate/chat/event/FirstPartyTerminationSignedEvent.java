package com.corp.formmate.chat.event;

import com.corp.formmate.form.entity.FormEntity;
import lombok.Getter;

@Getter
public class FirstPartyTerminationSignedEvent {
    private final FormEntity form;
    private final Integer signedByUserId;

    public FirstPartyTerminationSignedEvent(FormEntity form, Integer signedByUserId) {
        this.form = form;
        this.signedByUserId = signedByUserId;
    }
}
