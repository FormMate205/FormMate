package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 계약 파기 응답 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 파기 응답")
public class FormTerminationResponse {
    @Schema(description = "계약 ID", example = "42")
    private Integer formId;

    @Schema(description = "계약 상태", example = "TERMINATION_REQUESTED")
    private String status;

    @Schema(description = "계약 상태 한글명", example = "종료요청")
    private String statusKorName;

    @Schema(description = "요청자 Id", example = "1")
    private Integer requestedById;
}
