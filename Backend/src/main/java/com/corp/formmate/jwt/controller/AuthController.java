package com.corp.formmate.jwt.controller;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.global.error.exception.AuthException;
import com.corp.formmate.global.error.exception.TokenException;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.dto.LoginRequest;
import com.corp.formmate.user.dto.LoginResponse;
import com.corp.formmate.user.dto.LogoutResponse;
import com.corp.formmate.user.dto.TokenRefreshResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenService jwtTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtProperties jwtProperties;

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // Spring Security의 인증 매커니즘을 사용하여 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // 인증 정보를 SecurityContext에 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 사용자 정보 조회
            UserEntity user = userService.selectByEmail(loginRequest.getEmail());

            // 토큰 생성
            Token token = jwtTokenService.createTokens(user.getId());

            // Refresh Token을 쿠키에 저장
            jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

            // 응답 객체 생성
            LoginResponse loginResponse = new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getUserName()
            );

            // Header에 Access Token 포함
            return ResponseEntity.status(HttpStatus.OK)
                    .header("Authorization", "Bearer " + token.getAccessToken())
                    .body(loginResponse);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            throw new AuthException(ErrorCode.LOGIN_FAILED);
        }
    }

    /**
     * 토큰 갱신 API
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 쿠키에서 Refresh Token 추출
            String refreshToken = jwtTokenProvider.resolveRefreshToken(request);

            if (refreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh token not found"));
            }

            // 토큰 갱신
            Token token = jwtTokenService.refreshToken(refreshToken);

            // 새로운 Refresh Token을 쿠키에 설정
            jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

            // 응답 객체 생성
            TokenRefreshResponse refreshResponse = new TokenRefreshResponse(
                    token.getAccessToken(),
                    "Token refreshed successfully"
            );

            // Header에 새로운 Access Token 포함
            return ResponseEntity.status(HttpStatus.OK)
                    .header("Authorization", "Bearer " + token.getAccessToken())
                    .body(refreshResponse);

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new TokenException(ErrorCode.INVALID_TOKEN);
        }
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }

            // Access Token에서 사용자 ID 추출
            String token = jwtTokenProvider.resolveToken(request);
            if (token != null) {
                String userIdStr = jwtTokenProvider.getUserIdFromToken(token);
                int userId = Integer.parseInt(userIdStr);

                // Refresh Token 삭제
                jwtTokenService.logout(userId);
            }

            // 쿠키 삭제
            Cookie cookie = new Cookie("refresh_token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(jwtProperties.isSecureFlag());
            cookie.setPath("/");
            cookie.setMaxAge(0); // 즉시 만료
            response.addCookie(cookie);

            return ResponseEntity.status(HttpStatus.OK).body(new LogoutResponse("Logged out successfully"));
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            throw new AuthException(ErrorCode.LOGOUT_FAILED);
        }
    }
}
