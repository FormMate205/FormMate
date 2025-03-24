package com.corp.formmate.form.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.corp.formmate.form.entity.RepaymentMethod;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "차용증 수정 요청")
public class FormUpdateRequest {

	@Schema(
		description = "채권자 이름",
		example = "홍길동"
	)
	private String creditorName;

	@Schema(
		description = "채권자 주소",
		example = "서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호"
	)
	private String creditorAddress;

	@Schema(
		description = "채권자 전화번호",
		example = "010-1234-5678"
	)
	private String creditorPhone;

	@Schema(
		description = "채권자 은행",
		example = "국민은행"
	)
	private String creditorBank;

	@Schema(
		description = "채권자 계좌번호",
		example = "123-456-789"
	)
	private String creditorAccount;

	@Schema(
		description = "채무자 이름",
		example = "김철수"
	)
	private String debtorName;

	@Schema(
		description = "채무자 주소",
		example = "서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호"
	)
	private String debtorAddress;

	@Schema(
		description = "채무자 전화번호",
		example = "010-9876-5432"
	)
	private String debtorPhone;

	@Schema(
		description = "채무자 은행",
		example = "신한은행"
	)
	private String debtorBank;

	@Schema(
		description = "채무자 계좌번호",
		example = "987-654-321"
	)
	private String debtorAccount;

	@Schema(
		description = "계약 체결일",
		example = "2025-03-21T00:00:00"
	)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime contractDate;

	@Schema(
		description = "계약 체결일",
		example = "2025-03-21T00:00:00"
	)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime maturityDate;

	@Schema(
		description = "대출 금액",
		example = "10000000"
	)
	private Long loanAmount;

	@Schema(
		description = "상환 방법 (원금균등상환, 원리금균등상환, 원금상환)",
		example = "원리금균등상환"
	)
	private RepaymentMethod repaymentMethod;

	@Schema(
		description = "상환일 (매달 며칠)",
		example = "25"
	)
	private Integer repaymentDay;

	@Schema(
		description = "이자율",
		example = "5.00"
	)
	private BigDecimal interestRate;

	@Schema(
		description = "중도상환수수료율",
		example = "1.50"
	)
	private BigDecimal earlyRepaymentFeeRate;

	@Schema(
		description = "연체이자율",
		example = "15.00"
	)
	private BigDecimal overdueInterestRate;

	@Schema(
		description = "기한이익상실이 발동될 연체 횟수",
		example = "3"
	)
	private Integer overdueLimit;
}
