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
@Schema(description = "계좌 이체 거래 응답")
@Builder
public class BankTransferResponse {

	@JsonProperty("Header")
	private Header header;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class Header {
		private String responseCode;
	}
}
