package com.corp.formmate.fcmtoken.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "Fcm 토큰 등록 요청")
public class FcmTokenCreateRequest {

	@Schema(
		description = "fcm 토큰",
		example = "dIAaS3xaO8BxKk12nU4xdR:APA91bG5Z-WN2AhFV9ctKnAOKz3u4lZ1rMoZoDeMvV_5IlF1Z-yw-vC-Vs0gICWjJxVZGejG9SpkL8k5kC8WgVRf8u7kJe-NMGbS_c7eKTYhldc0RRlaKya2UN0JvY8KvH8HIpNsdMST",
		required = true
	)
	@NotNull(message = "fcm 토큰은 필수 입니다.")
	private String token;
}
