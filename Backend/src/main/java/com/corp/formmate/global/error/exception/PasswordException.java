package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

public class PasswordException extends BusinessException {
    public PasswordException(ErrorCode errorCode) {
        super(errorCode);
    }
}
