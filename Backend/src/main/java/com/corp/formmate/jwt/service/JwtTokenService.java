package com.corp.formmate.jwt.service;

import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.jwt.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * 토큰 발급 (로그인, 회원가입 시 사용)
     */

    @Transactional
    public Token createTokens(int userId) {
        // Access Token과 Refresh Token 생성
        String accessToken = jwtTokenProvider.createAccessToken(userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);

        // Refresh Token을 Redis에 저장 (사용자 ID를 키로 사용)
        refreshTokenRepository.saveRefreshToken(String.valueOf(userId), refreshToken);

        return new Token(accessToken, refreshToken);
    }

    /**
     * 토큰 재발급 (Access Token 만료시 사용)
     */
    @Transactional
    public Token refreshToken(String refreshToken) {
        // Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Refresh Token에서 사용자 ID 추출
        String userIdStr = jwtTokenProvider.getUserIdFromToken(refreshToken);
        int userId = Integer.parseInt(userIdStr);
        
        // Redis에 저장된 Refresh Token과 비교
        String savedRefreshToken = refreshTokenRepository.findRefreshToken(userIdStr);
        if (savedRefreshToken == null || !savedRefreshToken.equals(refreshToken)) {
            throw new RuntimeException("Refresh token is not in database or doesn't match");
        }

        // 새로운 토큰 발급
        return createTokens(userId);
    }

    /**
     * 로그아웃 시 Refresh Token 삭제
     */
    @Transactional
    public void logout(int userId) {
        refreshTokenRepository.deleteRefreshToken(String.valueOf(userId));
    }

    /**
     * 응답에 Refresh Token을 쿠키로 설정
     */
    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken, boolean secure) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true); // JavaScript에서 접근 불가능하게 설정
        cookie.setSecure(secure); // HTTPS에서만 전송(프로덕션 환경에서는 true로 설정)
        cookie.setPath("/"); // 모든 경로에서 쿠키 접근 가능
        cookie.setMaxAge((int) (jwtTokenProvider.getRefreshTokenExpiration() /1000)); // 초 단위로 설정

        response.addCookie(cookie);
    }
}
