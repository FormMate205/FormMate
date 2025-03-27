package com.corp.formmate.mypage.dto;

import com.corp.formmate.user.entity.Provider;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter
@Service
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "마이페이지 회원 상세 정보 조회 응답")
public class DetailProfileResponse {
    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "전화번호", example = "01012345678")
    private String phoneNumber;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "가입 제공자", example = "LOCAL")
    private Provider provider;
}
