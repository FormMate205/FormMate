package com.corp.formmate.jwt.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.AuthException;
import com.corp.formmate.global.error.exception.TokenException;
import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.entity.RefreshTokenEntity;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.jwt.repository.RefreshTokenRepository;
import com.corp.formmate.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;

    /**
     * 토큰 발급 (로그인, 회원가입 시 사용)
     */
    @Transactional
    public Token createTokens(int userId) {
        try {
            // Access Token과 Refresh Token 생성
            String accessToken = jwtTokenProvider.createAccessToken(userId);
            String refreshToken = jwtTokenProvider.createRefreshToken(userId);

            // Refresh Token을 Redis에 저장 (사용자 ID를 키로 사용)
            String userIdStr = String.valueOf(userId);
            RefreshTokenEntity tokenEntity = RefreshTokenEntity.builder()
                    .id(userIdStr)
                    .token(refreshToken)
                    .ttl(jwtTokenProvider.getRefreshTokenExpiration() / 1000) // Redis는 초 단위로 TTL 저장
                    .build();

            refreshTokenRepository.save(tokenEntity);

            return new Token(accessToken, refreshToken);
        } catch (Exception e) {
            log.error("Token creation failed: {}", e.getMessage());
            throw new TokenException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 토큰 재발급 (Access Token 만료시 사용)
     */
    @Transactional
    public Token refreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new TokenException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        // Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new TokenException(ErrorCode.INVALID_TOKEN);
        }

        try {
            // Refresh Token에서 사용자 ID 추출
            String userIdStr = jwtTokenProvider.getUserIdFromToken(refreshToken);
            int userId = Integer.parseInt(userIdStr);

            // Redis에 저장된 Refresh Token과 비교
            RefreshTokenEntity savedToken = refreshTokenRepository.findById(userIdStr)
                    .orElseThrow(() -> new TokenException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

            if (!savedToken.getToken().equals(refreshToken)) {
                throw new TokenException(ErrorCode.INVALID_TOKEN);
            }

            // 새로운 토큰 발급
            return createTokens(userId);
        } catch (NumberFormatException e) {
            log.error("Invalid user ID in token: {}", e.getMessage());
            throw new TokenException(ErrorCode.INVALID_TOKEN);
        } catch (TokenException e) {
            throw e;
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new TokenException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 로그아웃 시 Refresh Token 삭제 및 쿠키 만료 처리
     */
    @Transactional
    public void logout(String token, Authentication authentication, HttpServletResponse response) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new AuthException(ErrorCode.NOT_AUTHENTICATED);
            }

            if (token != null) {
                String userIdStr = jwtTokenProvider.getUserIdFromToken(token);
                int userId = Integer.parseInt(userIdStr);

                // Refresh Token 삭제
                refreshTokenRepository.deleteById(String.valueOf(userId));
            } else {
                // 토큰이 없는 경우 - 사용자 정보에서 ID 추출
                if (authentication.getPrincipal() instanceof UserDetails) {
                    String username = ((UserDetails)authentication.getPrincipal()).getUsername();
                    // username이 email이므로 이메일로 사용자 ID를 조회하는 로직
                    int userId = userService.selectByEmail(username).getId();
                    refreshTokenRepository.deleteById(String.valueOf(userId));
                }
            }

            // 쿠키 삭제
            Cookie cookie = new Cookie("refresh_token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // HTTPS 사용시
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);

        } catch (AuthException e) {
            throw e;
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            throw new AuthException(ErrorCode.LOGOUT_FAILED);
        }
    }

    /**
     * 응답에 Refresh Token을 쿠키로 설정
     */
    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken, boolean secure) {
        try {
            Cookie cookie = new Cookie("refresh_token", refreshToken);
            cookie.setHttpOnly(true); // JavaScript에서 접근 불가능하게 설정
            cookie.setSecure(secure); // HTTPS에서만 전송(프로덕션 환경에서는 true로 설정)
            cookie.setPath("/"); // 모든 경로에서 쿠키 접근 가능
            cookie.setMaxAge((int) (jwtTokenProvider.getRefreshTokenExpiration() /1000)); // 초 단위로 설정

            // SamSite 속성 설정
            response.addHeader("Set-Cookie", cookie.getName() + "=" + cookie.getValue()
            + "; Max-Age=" + cookie.getMaxAge()
            + "; Path=" + cookie.getPath()
            + (cookie.isHttpOnly() ? "; HttpOnly" : "")
            + (secure ? "; Secure" : "")
            + "; SamSite=None");
//
//            response.addCookie(cookie);

//            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
//                    .httpOnly(true)
//                    .secure(secure)
//                    .path("/")
//                    .maxAge(jwtTokenProvider.getRefreshTokenExpiration() / 1000)
//                    .sameSite(secure ? "None" : "Lax")  // HTTPS일 때는 None, 아닐 때는 Lax
//                    .build();
//
//            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        } catch (Exception e) {
            log.error("Setting refresh token cookie failed: {}", e.getMessage());
            throw new TokenException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
