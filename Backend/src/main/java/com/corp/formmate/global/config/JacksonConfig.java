package com.corp.formmate.global.config;

import java.io.IOException;
import java.util.TimeZone;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();

		// 시간대 설정 추가
		objectMapper.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));

		// 기존 JavaTimeModule 등록
		objectMapper.registerModule(new JavaTimeModule());

		// Page 직렬화를 위한 새로운 모듈 등록
		SimpleModule pageModule = new SimpleModule();
		pageModule.addSerializer(Page.class, new JsonSerializer<Page>() {
			@Override
			public void serialize(Page page, JsonGenerator gen, SerializerProvider serializers) throws IOException {
				gen.writeStartObject();

				// content
				gen.writeObjectField("content", page.getContent());

				// totalElements
				gen.writeNumberField("totalElements", page.getTotalElements());

				// totalPages
				gen.writeNumberField("totalPages", page.getTotalPages());

				// pageable 정보
				gen.writeObjectFieldStart("pageable");
				gen.writeNumberField("page", page.getNumber());
				gen.writeNumberField("size", page.getSize());

				// sort 정보
				gen.writeObjectFieldStart("sort");
				Sort sort = page.getSort();
				gen.writeBooleanField("sorted", !sort.isEmpty());
				gen.writeStringField("direction", sort.stream()
					.findFirst()
					.map(order -> order.getDirection().name())
					.orElse("DESC"));
				gen.writeEndObject();

				gen.writeEndObject();
				gen.writeEndObject();
			}
		});
		objectMapper.registerModule(pageModule);

		return objectMapper;
	}

}
