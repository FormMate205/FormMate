package com.corp.formmate.form.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * 계약 파기 인증 요청 DTO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계약 파기 인증 요청")
public class FormTerminationVerifyRequest {

    @Schema(description = "사용자 이름", example = "홍길동", required = true)
    @NotBlank(message = "사용자 이름은 필수입니다")
    private String userName;

    @Schema(description = "전화번호", example = "01012345678", required = true)
    @NotBlank(message = "전화번호는 필수입니다")
    private String phoneNumber;

}
