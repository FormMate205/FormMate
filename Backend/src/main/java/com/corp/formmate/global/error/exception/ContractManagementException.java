package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class ContractManagementException extends BusinessException {
	public ContractManagementException(ErrorCode errorCode) {
		super(errorCode);
	}
}
