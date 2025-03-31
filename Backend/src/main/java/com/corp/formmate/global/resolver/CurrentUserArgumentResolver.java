package com.corp.formmate.global.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;

@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.hasParameterAnnotation(CurrentUser.class)
			&& AuthUser.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	public Object resolveArgument(MethodParameter parameter,
		ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest,
		WebDataBinderFactory binderFactory) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()
			|| "anonymousUser".equals(authentication.getPrincipal())) {
			throw new AuthenticationCredentialsNotFoundException("로그인이 필요합니다.");
		}

		return authentication.getPrincipal(); // 보통 AuthUser 객체
	}
}

