package com.corp.formmate.alert.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "알림 조회 응답")
@Builder
public class AlertUnreadResponse {

	@Schema(
		description = "알림 ID",
		example = "1"
	)
	private Integer alertId;

	@Schema(
		description = "알림 타입",
		example = "연체"
	)
	private String alertType;

	@Schema(
		description = "알림 내용",
		example = "장원영님과의 계약이 제대로 이행되지 않았습니다."
	)
	private String content;

	@Schema(
		description = "알림 읽음 여부(읽음 = true, 읽지않음 = false)",
		example = "true"
	)
	private Boolean isRead;

	@Schema(
		description = "알림이 생성된 시간",
		example = "2025-03-21T00:00:00"
	)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdAt;

}
