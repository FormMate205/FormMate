package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class TransferException extends BusinessException {
	public TransferException(ErrorCode errorCode) {
		super(errorCode);
	}
}
