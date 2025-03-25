package com.corp.formmate.form.dto;

import org.springframework.data.domain.Page;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예상 납부 스케줄 미리보기 응답")
public class PaymentPreviewResponse {

	@Schema(description = "총 상환금액", example = "10500000")
	private Long totalRepaymentAmount;

	@Schema(description = "총 납부회차", example = "12")
	private Integer totalInstallments;

	@Schema(description = "페이지네이션된 납부 스케줄")
	private Page<PaymentScheduleDto> schedulePage;
}