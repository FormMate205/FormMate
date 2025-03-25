package com.corp.formmate.form.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "납부 스케줄 항목")
public class PaymentScheduleResponse {

	@Schema(description = "납부회차", example = "1")
	private Integer installmentNumber;

	@Schema(description = "납부일", example = "2023-04-25")
	private LocalDateTime paymentDate;

	@Schema(description = "원금", example = "83333333")
	private Long principal;

	@Schema(description = "이자", example = "4166667")
	private Long interest;

	@Schema(description = "납부금액", example = "87500000")
	private Long paymentAmount;
}