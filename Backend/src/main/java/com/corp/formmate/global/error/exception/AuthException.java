package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;
import lombok.Getter;

@Getter
public class AuthException extends BusinessException {
    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }
}
