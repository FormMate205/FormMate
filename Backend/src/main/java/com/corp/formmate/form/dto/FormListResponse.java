package com.corp.formmate.form.dto;

import com.corp.formmate.form.entity.FormEntity;
import com.corp.formmate.form.entity.FormStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "차용증 전체 리스트 조회")
@Builder
public class FormListResponse {

	@Schema(
		description = "차용증 ID",
		example = "1"
	)
	private Integer formId;

	@Schema(
		description = "계약 상태",
		example = "IN_PROGRESS"
	)
	private FormStatus formStatus;

	@Schema(
		description = "상대방 이름",
		example = "2"
	)
	private String receiverName;

	public static FormListResponse fromEntity(FormEntity formEntity, Integer currentUserId) {
		String receiverName;

		if (formEntity.getCreditor().getId().equals(currentUserId)) {
			// 현재 사용자가 채권자인 경우, 채무자가 상대방
			receiverName = formEntity.getDebtorName();
		} else {
			// 현재 사용자가 채무자인 경우, 채권자가 상대방
			receiverName = formEntity.getCreditorName();
		}

		return FormListResponse.builder()
			.formId(formEntity.getId())
			.formStatus(formEntity.getStatus())
			.receiverName(receiverName)
			.build();
	}
}
