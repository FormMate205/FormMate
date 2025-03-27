package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "계약상대 조회 응답")
public class ContractPartnerSearchResponse {
    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "전화번호", example = "01012345678")
    private String phoneNumber;
}
