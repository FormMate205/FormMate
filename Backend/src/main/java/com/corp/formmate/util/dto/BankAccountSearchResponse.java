package com.corp.formmate.util.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계좌 조회 응답")
@Builder
public class BankAccountSearchResponse {

	@JsonProperty("REC")
	private REC rec;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class REC {
		private String bankCode;
		private String bankName;
		private String accountNo;
		private String accountBalance;
		private String currency;
	}
}
