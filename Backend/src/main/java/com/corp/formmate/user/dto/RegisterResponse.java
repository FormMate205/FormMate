package com.corp.formmate.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "회원가입 응답")
public class RegisterResponse {
    @Schema(description = "사용자 ID", example = "1")
    private Integer id;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
}