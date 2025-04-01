package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

/**
 * 계약 파기 서명 요청 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 파기 서명 요청")
public class FormTerminationSignRequest {

    @Schema(description = "계약 파기 동의 확인", example = "true", required = true)
    private Boolean consent;

}
