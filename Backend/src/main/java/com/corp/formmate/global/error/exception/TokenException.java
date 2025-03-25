package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;
import lombok.Getter;

@Getter
public class TokenException extends BusinessException {
    public TokenException(ErrorCode errorCode) {
        super(errorCode);
    }
}
