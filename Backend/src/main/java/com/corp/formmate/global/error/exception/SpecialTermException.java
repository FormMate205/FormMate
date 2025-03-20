package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class SpecialTermException extends BusinessException {
	public SpecialTermException(ErrorCode errorCode) {
		super(errorCode);
	}
}
