package com.corp.formmate.util.header;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class BankHeader {

	private String apiName;

	private String transmissionDate;

	private String transmissionTime;

	private String institutionCode;

	private String fintechAppNo;

	private String apiServiceCode;

	private String institutionTransactionUniqueNo;

	@Value("${bank.api.key}")
	private String apiKey;

	@Value("${bank.api.id}")
	private String userKey;

	// API 호출에 필요한 새 헤더 생성 메서드
	public BankHeader generateHeader(String apiName) {
		return forApiWithKeys(apiName, this.apiKey, this.userKey);
	}

	// 기본값 설정을 위한 정적 메서드
	public static BankHeaderBuilder defaultBuilder() {
		LocalDateTime now = LocalDateTime.now();
		return builder()
			.transmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
			.transmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")))
			.institutionCode("00100")
			.fintechAppNo("001")
			.institutionTransactionUniqueNo(generateUniqueNo());
	}

	// apiName 설정과 동시에 apiServiceCode도 설정하는 편의 메서드
	public static BankHeaderBuilder forApi(String apiName) {
		return defaultBuilder()
			.apiName(apiName)
			.apiServiceCode(apiName);
	}

	// 완전한 헤더 생성을 위한 편의 메서드
	public static BankHeader forApiWithKeys(String apiName, String apiKey, String userKey) {
		return forApi(apiName)
			.apiKey(apiKey)
			.userKey(userKey)
			.build();
	}

	// 20자리 난수 생성 메소드
	private static String generateUniqueNo() {
		Random random = new Random();
		StringBuilder sb = new StringBuilder(20);
		for (int i = 0; i < 20; i++) {
			sb.append(random.nextInt(10));
		}
		return sb.toString();
	}
}