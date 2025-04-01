package com.corp.formmate.global.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.corp.formmate.global.resolver.CurrentUserArgumentResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final CurrentUserArgumentResolver currentUserArgumentResolver;

	public WebConfig(CurrentUserArgumentResolver currentUserArgumentResolver) {
		this.currentUserArgumentResolver = currentUserArgumentResolver;
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(currentUserArgumentResolver);
	}
}
