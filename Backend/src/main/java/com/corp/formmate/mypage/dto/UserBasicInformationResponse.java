package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter
@Service
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "로그인 사용자 정보 응답")
public class UserBasicInformationResponse {
    @Schema(description = "사용자 ID", example = "1")
    private Integer id;

    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "로그인 여부", example = "true")
    private Boolean isLogged;

    @Schema(description = "계좌 등록 여부", example = "true")
    private Boolean hasAccount;
}
