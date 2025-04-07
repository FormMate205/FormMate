package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class UserException extends BusinessException {
	public UserException(ErrorCode errorCode) {
		super(errorCode);
	}
}
