package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class FcmTokenException extends BusinessException {
	public FcmTokenException(ErrorCode errorCode) {
		super(errorCode);
	}
}
