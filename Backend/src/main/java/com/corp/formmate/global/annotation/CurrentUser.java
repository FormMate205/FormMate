package com.corp.formmate.global.annotation;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : user")
public @interface CurrentUser {
    // Spring Security의 @AuthenticaitonPrincaipla을 확장하는 커스텀 어노테이션
}
