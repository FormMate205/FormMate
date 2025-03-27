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
public class BankTransferRequest implements BankApiRequest {

	@Schema(
		description = "입금계좌번호",
		example = "0030924135036561"
	)
	private String depositAccountNo;

	@Schema(
		description = "거래금액",
		example = "100000000"
	)
	private Long transactionBalance;

	@Schema(
		description = "출금계좌번호",
		example = "0030924135036561"
	)
	private String withdrawalAccountNo;

	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> map = new HashMap<>();
		map.put("depositAccountNo", depositAccountNo);
		map.put("transactionBalance", transactionBalance);
		map.put("withdrawalAccountNo", withdrawalAccountNo);
		map.put("depositTransactionSummary", "입금");
		map.put("withdrawalTransactionSummary", "출금");
		return map;
	}
}
