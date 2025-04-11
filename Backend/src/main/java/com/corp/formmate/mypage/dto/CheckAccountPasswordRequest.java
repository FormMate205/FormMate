package com.corp.formmate.mypage.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "계좌 비밀번호 확인 요청")
public class CheckAccountPasswordRequest {

	@NotBlank(message = "계좌 비밀번호는 필수 입력 항목입니다.")
	@Schema(description = "계좌 비밀번호", example = "123456", required = true)
	private String accountPassword;

}
