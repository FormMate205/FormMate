package com.corp.formmate.form.dto;

import com.corp.formmate.form.entity.FormEntity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "차용증 체결 응답")
@Builder
public class FormConfirmVerifyResponse {

	@Schema(
		description = "차용증 ID",
		example = "1"
	)
	private Integer formId;

	@Schema(
		description = "차용증 상태",
		example = "상대승인후"
	)
	private String status;

	public static FormConfirmVerifyResponse fromEntity(FormEntity form) {
		return FormConfirmVerifyResponse.builder()
			.formId(form.getId())
			.status(form.getStatus().getKorName())
			.build();
	}
}
