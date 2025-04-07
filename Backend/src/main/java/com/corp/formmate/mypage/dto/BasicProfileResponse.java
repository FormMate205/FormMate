package com.corp.formmate.mypage.dto;

import com.corp.formmate.user.entity.Provider;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 마이페이지 회원정보 조회 응답
 */
@Getter
@Service
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "마이페이지 회원정보 조회 응답")
public class BasicProfileResponse {
    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "전화번호", example = "01012345678")
    private String phoneNumber;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 123")
    private String address;

    @Schema(description = "상세 주소", example = "456동 789호")
    private String addressDetail;

    @Schema(description = "가입 제공자", example = "LOCAL")
    private Provider provider;
}
