package com.corp.formmate.jwt.filter;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.user.service.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetailsService customUserDetailsService;

	@Autowired
	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
		@Lazy CustomUserDetailsService customUserDetailsService) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.customUserDetailsService = customUserDetailsService;
	}

	//    @Override
	//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
	//        // HTTP 요청에서 토큰 추출
	//        String token = jwtTokenProvider.resolveToken(request);
	//
	//        log.debug("Resolved token: {}", token != null ? "Token exists" : "No token");
	//
	//        // 권한이 필요 없는 경로는 바로 통과
	//        if (isPermitAllUrl(request.getRequestURI())) {
	//            filterChain.doFilter(request, response);
	//            return;
	//        }
	//
	//        try {
	//            // 토큰이 유효하면 인증 정보 설정
	//            if (token != null) {
	//                if (jwtTokenProvider.validateToken(token)) {
	//                    // 수정된 부분: Authentication 생성 로직 변경
	//                    Integer userId = jwtTokenProvider.getUserIdFromTokenAsInteger(token);
	//                    UserDetails userDetails = customUserDetailsService.loadUserById(userId);
	//                    Authentication auth = new UsernamePasswordAuthenticationToken(
	//                            userDetails, "", userDetails.getAuthorities());
	//
	//                    SecurityContextHolder.getContext().setAuthentication(auth);
	//                    log.debug("Set Authentication to security context for '{}', uri: {}",
	//                            auth.getName(), request.getRequestURI());
	//                } else {
	//                    log.debug("Invalid token");
	//                }
	//            } else {
	//                log.debug("No token provided for URL: {}", request.getRequestURI());
	//            }
	//            filterChain.doFilter(request, response);
	//        } catch (ExpiredJwtException e) {
	//            log.error("JWT token expired: {}", e.getMessage());
	//            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다. 다시 로그인해주세요.");
	//        } catch (SecurityException | MalformedJwtException e) {
	//            log.error("Invalid JWT signature: {}", e.getMessage());
	//            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
	//        } catch (UnsupportedJwtException e) {
	//            log.error("JWT token is unsupported: {}", e.getMessage());
	//            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "지원되지 않는 토큰 형식입니다.");
	//        } catch (IllegalArgumentException e) {
	//            log.error("JWT claims string is empty: {}", e.getMessage());
	//            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "토큰 정보가 올바르지 않습니다.");
	//        } catch (Exception e) {
	//            log.error("Cannot set user authentication: {}", e.getMessage());
	//            sendErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "인증 처리 중 오류가 발생했습니다.");
	//        }
	//    }

	// 개발용 doFilterInternal
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		// HTTP 요청에서 토큰 추출
		String token = jwtTokenProvider.resolveToken(request);

		// 권한이 필요 없는 경로는 바로 통과
		if (isPermitAllUrl(request.getRequestURI())) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			// 토큰이 있고 유효하면 인증 정보 설정
			if (token != null && jwtTokenProvider.validateToken(token)) {
				Integer userId = jwtTokenProvider.getUserIdFromTokenAsInteger(token);
				UserDetails userDetails = customUserDetailsService.loadUserById(userId);
				Authentication auth = new UsernamePasswordAuthenticationToken(
					userDetails, "", userDetails.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(auth);
			}
			// 개발 환경일 때 토큰이 없거나 유효하지 않은 경우
			else if (isDevelopmentMode()) {
				// 개발 모드: 요청 헤더에서 X-Test-User-Id 값을 확인
				String testUserIdHeader = request.getHeader("X-Test-User-Id");
				Integer testUserId = null;

				try {
					if (testUserIdHeader != null && !testUserIdHeader.isEmpty()) {
						testUserId = Integer.parseInt(testUserIdHeader);
					}
				} catch (NumberFormatException e) {
					log.warn("Invalid X-Test-User-Id header value: {}", testUserIdHeader);
				}

				// 테스트 사용자 ID가 제공되었으면 해당 ID로 인증, 아니면 기본값 사용
				Integer userId = testUserId != null ? testUserId : 1; // 기본값은 필요에 따라 변경

				try {
					UserDetails userDetails = customUserDetailsService.loadUserById(userId);
					Authentication auth = new UsernamePasswordAuthenticationToken(
						userDetails, "", userDetails.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(auth);
					log.debug("Development mode: Set test user authentication for ID: {}", userId);
				} catch (Exception e) {
					log.warn("Failed to set test user authentication: {}", e.getMessage());
				}
			}

			filterChain.doFilter(request, response);
		} catch (Exception e) {
			// 기존 예외 처리
			sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "인증에 실패했습니다: " + e.getMessage());
		}
	}

	// 개발 모드인지 확인하는 메서드
	private boolean isDevelopmentMode() {
		// 여기서 개발 모드인지 확인하는 로직 구현
		// 예: 특정 시스템 프로퍼티 확인, 환경 변수 확인 등
		return true; // 지금은 항상 개발 모드로 간주 (배포 전에 수정 필요)
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
			requestURI.startsWith("/api/") ||
			requestURI.startsWith("api/api-docs/");

	}
}
