package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "로그인 응답")
public class LoginResponse {
    @Schema(description = "사용자 ID", example = "1")
    private Integer userId;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "추가 정보 필요 여부", example = "true")
    private Boolean needsAdditionalInfo;
}
