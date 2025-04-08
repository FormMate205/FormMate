package com.corp.formmate.form.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FormException;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예상 납부 스케줄 미리보기 요청")
public class PaymentPreviewRequest {

	@Schema(
		description = "대출 금액",
		example = "10000000",
		required = true
	)
	@NotNull(message = "대출 금액은 필수입니다")
	@Positive(message = "대출 금액은 양수여야 합니다")
	private Long loanAmount;

	@Schema(
		description = "만기일",
		example = "2026-03-20T00:00:00",
		required = true
	)
	@NotNull(message = "만기일은 필수입니다")
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime maturityDate;

	@Schema(
		description = "이자율 (최대 20%)",
		example = "5.00",
		required = true
	)
	@Pattern(regexp = "^\\d{1,3}(\\.\\d{1,2})?$", message = "이자율은 전체 5자리(소수점 아래 2자리 포함)까지 입력 가능합니다")
	private String interestRate;

	@Schema(
		description = "상환일 (매달 며칠)",
		example = "25",
		required = true
	)
	@NotNull(message = "상환일은 필수입니다")
	@Min(value = 0, message = "상환일은 0일 이상이어야 합니다(0 == 분할납부 하지 않음)")
	@Max(value = 31, message = "상환일은 31일 이하여야 합니다")
	private Integer repaymentDay;

	@Schema(
		description = "상환 방법 (원금균등상환, 원리금균등상환, 원금상환)",
		example = "원리금균등상환",
		required = true
	)
	@NotNull(message = "상환 방법은 필수입니다")
	private String repaymentMethod;

	public void validate() {
		// 이자율 검증 (최대 20%)
		if (interestRate != null && !interestRate.isEmpty()) {
			try {
				BigDecimal rate = new BigDecimal(interestRate);
				if (rate.compareTo(new BigDecimal("20.00")) > 0) {
					throw new FormException(ErrorCode.INVALID_INTEREST_AND_OVERDUE);
				}
			} catch (NumberFormatException e) {
				throw new FormException(ErrorCode.INVALID_INTEREST_RATE);
			}
		}
	}

	protected BigDecimal toBigDecimal(String value) {
		if (value == null || value.isEmpty()) {
			return BigDecimal.ZERO;
		}
		try {
			BigDecimal rate = new BigDecimal(value);
			if (rate.compareTo(BigDecimal.ZERO) <= 0) {
				return BigDecimal.ZERO;
			}
			return rate;
		} catch (NumberFormatException e) {
			throw new FormException(ErrorCode.INVALID_INPUT_VALUE);
		}
	}

	@JsonIgnore
	public BigDecimal getInterestRateAsBigDecimal() {
		return toBigDecimal(this.interestRate);
	}

	public PaymentPreviewRequest(FormEntity form) {
		this.interestRate = String.valueOf(form.getInterestRate());
		this.loanAmount = form.getLoanAmount();
		this.maturityDate = form.getMaturityDate();
		this.repaymentMethod = form.getRepaymentMethod().getKorName();
		this.repaymentDay = form.getRepaymentDay();
	}

}
