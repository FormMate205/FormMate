package com.corp.formmate.form.dto;

import com.corp.formmate.form.entity.FormStatus;
import com.corp.formmate.form.entity.TerminationProcess;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 요약 정보")
public class FormInformation {
    @Schema(description = "채권자 ID", example = "15")
    private Integer creditorId;

    @Schema(description = "채무자 ID", example = "16")
    private Integer debtorId;

    @Schema(description = "계약 상태", example = "BEFORE_APPROVAL")
    private FormStatus formStatus;

    @Schema(description = "파기 상태", example = "NONE")
    private TerminationProcess terminationStatus;

    @Schema(description = "파기 신청자", example = "1")
    private Integer terminationRequestedId;
}
