package com.corp.formmate.global.security;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        log.error("인증 실패: {}", authException.getMessage());

        ErrorCode errorCode;

        // 예외 유형에 따라 다른 에러 코드 반환
        if (authException instanceof BadCredentialsException) {
            errorCode = ErrorCode.LOGIN_BAD_CREDENTIALS;
        } else if (authException instanceof UsernameNotFoundException) {
            errorCode = ErrorCode.USER_NOT_FOUND;
        } else if (authException instanceof InsufficientAuthenticationException
                || authException instanceof AuthenticationCredentialsNotFoundException) {
            errorCode = ErrorCode.UNAUTHORIZED;
        } else {
            errorCode = ErrorCode.LOGIN_FAILED;
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(errorCode.getStatus())
                .message(errorCode.getMessage())
                .build();

        response.setStatus(errorCode.getStatus());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
