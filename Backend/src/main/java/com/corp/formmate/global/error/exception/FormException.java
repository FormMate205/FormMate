package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class FormException extends BusinessException {
	public FormException(ErrorCode errorCode) {
		super(errorCode);
	}
}
