package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class PaymentScheduleException extends BusinessException {
	public PaymentScheduleException(ErrorCode errorCode) {
		super(errorCode);
	}
}
