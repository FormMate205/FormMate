package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 파기 서명 확인")
public class FormTerminationConfirmRequest {
    private FormTerminationVerifyConfirmRequest verifyRequest;
    private FormTerminationSignRequest signRequest;
}
