package com.corp.formmate.contract.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UserIdRequest {
	@Schema(
		description = "사용자 ID",
		example = "1",
		required = true
	)
	private Integer id;
}
