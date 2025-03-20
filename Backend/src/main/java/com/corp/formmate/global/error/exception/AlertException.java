package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class AlertException extends BusinessException {
	public AlertException(ErrorCode errorCode) {
		super(errorCode);
	}
}
