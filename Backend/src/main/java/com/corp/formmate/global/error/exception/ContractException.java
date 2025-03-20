package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class ContractException extends BusinessException {
	public ContractException(ErrorCode errorCode) {
		super(errorCode);
	}
}
