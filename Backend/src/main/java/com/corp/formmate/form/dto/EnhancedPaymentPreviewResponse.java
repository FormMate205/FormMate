package com.corp.formmate.form.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "고급 납부 계획 응답")
public class EnhancedPaymentPreviewResponse {

	@Schema(description = "총 납부 예정 금액", example = "100000000")
	private Long totalRepaymentAmount;

	@Schema(description = "총 회차 수", example = "12")
	private Integer totalInstallments;

	@Schema(description = "회차별 납부 상세 목록")
	private List<EnhancedPaymentScheduleResponse> scheduleList;
}