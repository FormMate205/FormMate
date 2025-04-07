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
@Schema(description = "1원 송금 응답")
@Builder
public class BankSendOneWonResponse {

	@JsonProperty("Header")
	private Header header;

	@JsonProperty("REC")
	private REC rec;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Header {
		private String responseCode;
	}

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class REC {
		private Long transactionUniqueNo;
		private String accountNo;
	}
}
