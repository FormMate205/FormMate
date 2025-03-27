package com.corp.formmate.util.dto;

import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankVerifyOneWonRequest implements BankApiRequest {

	@Schema(
		description = "계좌번호",
		example = "0030924135036561"
	)
	private String accountNo;

	@Schema(
		description = "인증 코드",
		example = "3456"
	)
	private String authCode;

	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> map = new HashMap<>();
		map.put("accountNo", accountNo);
		map.put("authText", "formmate");
		map.put("authCode", authCode);
		return map;
	}
}