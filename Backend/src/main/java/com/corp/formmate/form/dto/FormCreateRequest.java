package com.corp.formmate.form.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.entity.RepaymentMethod;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.FormException;
import com.corp.formmate.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "차용증 생성 요청")
public class FormCreateRequest {

	@Schema(
		description = "계약서 수신자 ID",
		example = "2",
		required = true
	)
	@NotNull(message = "수신자 ID는 필수입니다")
	private Integer receiverId;

	@Schema(
		description = "채권자 ID",
		example = "1",
		required = true
	)
	@NotNull(message = "채권자 ID는 필수입니다")
	private Integer creditorId;

	@Schema(
		description = "채무자 ID",
		example = "3",
		required = true
	)
	@NotNull(message = "채무자 ID는 필수입니다")
	private Integer debtorId;

	@Schema(
		description = "만기일",
		example = "2026-03-20",
		required = true
	)
	@NotNull(message = "만기일은 필수입니다")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDateTime maturityDate;

	@Schema(
		description = "대출 금액",
		example = "10000000",
		required = true
	)
	@NotNull(message = "대출 금액은 필수입니다")
	@Positive(message = "대출 금액은 양수여야 합니다")
	private Long loanAmount;

	@Schema(
		description = "상환 방법 (원금균등상환, 원리금균등상환, 원금상환)",
		example = "원리금균등상환",
		required = true
	)
	@NotNull(message = "상환 방법은 필수입니다")
	private String repaymentMethod;

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
		description = "이자율 (최대 20%)",
		example = "5.00",
		required = true
	)
	@Pattern(regexp = "^\\d{1,3}(\\.\\d{1,2})?$", message = "이자율은 전체 5자리(소수점 아래 2자리 포함)까지 입력 가능합니다")
	private String interestRate;

	@Schema(
		description = "중도상환수수료율",
		example = "1.50",
		required = true
	)
	@Pattern(regexp = "^\\d{1,3}(\\.\\d{1,2})?$", message = "중도상환수수료율은 전체 5자리(소수점 아래 2자리 포함)까지 입력 가능합니다")
	private String earlyRepaymentFeeRate;

	@Schema(
		description = "연체이자율 (이자율과의 합이 20%를 넘을 수 없음)",
		example = "15.00",
		required = true
	)
	@Pattern(regexp = "^\\d{1,3}(\\.\\d{1,2})?$", message = "연체이자율은 전체 5자리(소수점 아래 2자리 포함)까지 입력 가능합니다")
	private String overdueInterestRate;

	@Schema(
		description = "기한이익상실이 발동될 연체 횟수",
		example = "3",
		required = true
	)
	@Min(value = 0, message = "연체 횟수는 0 이상이어야 합니다")
	private Integer overdueLimit;

	@Schema(
		description = """
			특약 조항의 index들이 담길 리스트입니다.
			1번 인덱스 : 채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다. 이는 대여금 반환 소송 등을 의미합니다.
			2번 인덱스 : 빌려간 돈을 생활비 등 특정 용도로 사용해야 하며, 도박 등 부적절한 용도로 사용할 수 없습니다.
			3번 인덱스 : 계약과 관련한 분쟁이 발생할 경우 대한민국 법률을 따르며, 관할 법원은 채권자 또는 채무자의 주소지를 고려하여 결정할 수 있습니다.
			4번 인덱스 : 채무자가 계약을 지키지 않을 경우, 발생하는 법적 비용(소송 비용 등)은 채무자가 부담해야 합니다.
			""",
		example = "[1, 2, 3]"
	)
	private List<Integer> specialTermIndexes;

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

		// 연체이자율 + 이자율 검증 (합이 20%를 넘지 않도록)
		if (interestRate != null && !interestRate.isEmpty() &&
			overdueInterestRate != null && !overdueInterestRate.isEmpty()) {
			try {
				BigDecimal baseRate = new BigDecimal(interestRate);
				BigDecimal overdueRate = new BigDecimal(overdueInterestRate);
				if (baseRate.add(overdueRate).compareTo(new BigDecimal("20.00")) > 0) {
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

	@JsonIgnore
	public BigDecimal getEarlyRepaymentFeeRateAsBigDecimal() {
		return toBigDecimal(this.earlyRepaymentFeeRate);
	}

	@JsonIgnore
	public BigDecimal getOverdueInterestRateAsBigDecimal() {
		return toBigDecimal(this.overdueInterestRate);
	}

	@Builder
	public FormEntity toEntity(FormCreateRequest formCreateRequest, UserEntity creator, UserEntity receiver,
		UserEntity creditor, UserEntity debtor) {
		Integer repaymentDay = formCreateRequest.getRepaymentDay();
		Integer overdueLimit = formCreateRequest.getOverdueLimit();
		if (repaymentDay == null || repaymentDay < 0) {
			repaymentDay = 0;
		}
		if (overdueLimit == null || overdueLimit < 0) {
			overdueLimit = 0;
		}
		return FormEntity.builder()
			.status(FormStatus.BEFORE_APPROVAL)
			.creator(creator)
			.receiver(receiver)
			.creditor(creditor)
			.debtor(debtor)
			.creditorName(creditor.getUserName())
			.creditorAddress(creditor.getAddress())
			.creditorPhone(creditor.getPhoneNumber())
			.creditorBank(creditor.getBankName()) // 여기 바꿔야해용
			.creditorAccount(creditor.getAccountNumber())
			.debtorName(debtor.getUserName())
			.debtorAddress(debtor.getAddress())
			.debtorPhone(debtor.getPhoneNumber())
			.debtorBank(debtor.getBankName())
			.debtorAccount(debtor.getAccountNumber()) // 여기 바꿔야해용
			.contractDate(LocalDateTime.now())
			.maturityDate(formCreateRequest.getMaturityDate())
			.loanAmount(formCreateRequest.getLoanAmount())
			.repaymentMethod(RepaymentMethod.fromKorName(formCreateRequest.getRepaymentMethod()))
			.repaymentDay(repaymentDay)
			.interestRate(formCreateRequest.getInterestRateAsBigDecimal())
			.earlyRepaymentFeeRate(formCreateRequest.getEarlyRepaymentFeeRateAsBigDecimal())
			.overdueInterestRate(formCreateRequest.getOverdueInterestRateAsBigDecimal())
			.overdueLimit(overdueLimit)
			.build();
	}
}
