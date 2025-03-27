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
@Schema(description = "계좌 조회 응답")
public class SearchMyAccountResponse {
    @Schema(description = "은행 이름", example = "한국은행")
    private String bankName;

    @Schema(description = "계좌 번호", example = "1112222233333")
    private String accountNumber;

    @Schema(description = "계좌 잔액", example = "1500000")
    private Long accountBalance;
}
