package com.corp.formmate.global.config;

import java.util.List;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("FormMate API Documentation")
				.description("<h3>FormMate Reference for Developers </h3>Swagger를 이용한 FormMate API")
				.version("v1.0")
				.contact(new Contact()
					.name("Support Team")
					.email("formmate205@gmail.com")
					.url("https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21A205"))
				.license(new License()
					.name("FormMate License")
					.url("https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21A205.git")))
			.externalDocs(new ExternalDocumentation()
				.description("FormMate Documentation")
				.url("https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21A205.git"))
			.servers(List.of(
				new Server().url("").description("Local server")
			))
			.components(new Components()
				.addSecuritySchemes("bearerAuth",
					new SecurityScheme()
						.type(SecurityScheme.Type.HTTP)
						.scheme("bearer")
						.bearerFormat("JWT")
						.in(SecurityScheme.In.HEADER)))
			.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
	}

	/**
	 * Swagger에서 @CurrentUser AuthUser authUser를 자동으로 제거하여 JSON 입력 없이 Bearer Token을 기반으로 인증 가능하게 설정
	 */
	@Bean
	public OperationCustomizer customizeOperation() {
		return (operation, handlerMethod) -> {
			List<Parameter> parameters = operation.getParameters();
			if (parameters != null) {
				parameters.removeIf(param -> param.getName().equals("authUser"));
			}
			return operation;
		};
	}
}

