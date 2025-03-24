package com.corp.formmate.jwt.filter;

import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // HTTP 요청에서 토큰 추출
        String token = jwtTokenProvider.resolveToken(request);

        // 권한이 필요 없는 경로는 바로 통과
        if (isPermitAllUrl(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 토큰이 유효하면 인증 정보 설정
            if (token != null) {
                if (jwtTokenProvider.validateToken(token)) {
                    Authentication auth = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.debug("Set Authentication to security context for '{}', uri: {}",
                            auth.getName(), request.getRequestURI());
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            log.error("JWT token expired: {}", e.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "지원되지 않는 토큰 형식입니다.");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "토큰 정보가 올바르지 않습니다.");
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
            sendErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "인증 처리 중 오류가 발생했습니다.");
        }
    }

    // 에러 응답 메서드 추가
    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", new Date());
        errorDetails.put("status", status.value());
        errorDetails.put("error", status.getReasonPhrase());
        errorDetails.put("message", message);

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(errorDetails);

        response.getWriter().write(jsonResponse);
    }

    // 권한 검사가 필요없는 URL 확인
    private boolean isPermitAllUrl(String requestURI) {
        return requestURI.startsWith("/api/auth") ||
                requestURI.startsWith("/api/public") ||
                requestURI.startsWith("/api/swagger-ui") ||
                requestURI.startsWith("api/api-docs/");
    }
}
