package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FormPartnerResponse {

	@Schema(
		description = "사용자 ID",
		example = "2"
	)
	private Integer userId;

	@Schema(
		description = "사용자 이름",
		example = "홍길동"
	)
	private String userName;

	@Schema(
		description = "전화번호",
		example = "010-1234-5678"
	)
	private String phoneNumber;

}
