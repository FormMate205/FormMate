package com.corp.formmate.global.error.exception;

import com.corp.formmate.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class ChatException extends BusinessException {
	public ChatException(ErrorCode errorCode) {
		super(errorCode);
	}
}
