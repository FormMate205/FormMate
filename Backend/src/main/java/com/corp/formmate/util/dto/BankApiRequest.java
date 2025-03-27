package com.corp.formmate.util.dto;

import java.util.Map;

public interface BankApiRequest {

	/**
	 * DTO 객체를 Map으로 변환
	 * @return API 요청 파라미터가 담긴 Map 객체
	 */
	Map<String, Object> toMap();
}
