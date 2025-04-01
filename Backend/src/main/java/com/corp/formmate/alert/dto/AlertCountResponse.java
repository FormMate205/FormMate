package com.corp.formmate.alert.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "읽지 않은 알림 개수 응답")
@Builder
public class AlertCountResponse {

	@Schema(
		description = "읽지 않은 알림 개수",
		example = "5"
	)
	private Long unreadAlertCount;
}
