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
@Schema(description = "고급 납부 스케줄 항목 (연체 이자 및 중도상환 수수료 포함)")
public class EnhancedPaymentScheduleResponse {

	@Schema(description = "납부회차", example = "1")
	private Integer installmentNumber;

	@Schema(description = "납부일", example = "2023-04-25")
	private LocalDateTime paymentDate;

	@Schema(description = "원금", example = "83333333")
	private Long principal;

	@Schema(description = "이자", example = "4166667")
	private Long interest;

	@Schema(description = "연체 이자", example = "100000")
	private Long overdueInterest;

	@Schema(description = "중도상환 수수료", example = "50000")
	private Long earlyRepaymentFee;

	@Schema(description = "총 납부금액 (원금 + 이자 + 연체이자 + 수수료)", example = "88000000")
	private Long paymentAmount;

	@Schema(description = "현재 회차 여부", example = "true")
	private Boolean isCurrentRound;
}
