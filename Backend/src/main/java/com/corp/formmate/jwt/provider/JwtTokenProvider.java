package com.corp.formmate.jwt.provider;

import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.user.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final UserDetailsService userDetailsService;

    // 시크릿 키 생성
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    // AccessToken 생성
    public String createAccessToken(Integer userId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration());

        return Jwts.builder()
                .subject(jwtProperties.getSubjectPrefix() + ":" + userId)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSigningKey())
                .compact();
    }

    // RefreshToken 생성
    public String createRefreshToken(Integer userId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtProperties.getRefreshTokenExpiration());

        return Jwts.builder()
                .subject(jwtProperties.getSubjectPrefix() + ":" + userId)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSigningKey())
                .compact();
    }

    // 임시 토큰 생성 (이메일 인증 등 용도)
    public String createTemporaryToken(Integer userId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtProperties.getTemporaryTokenExpiration());

        return Jwts.builder()
                .subject(jwtProperties.getSubjectPrefix() + ":" + userId)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSigningKey())
                .compact();
    }

    // 토큰에서 userId 추출
    public String getUserIdFromToken(String token) {
        String subject = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

        String userIdStr = subject.replace(jwtProperties.getSubjectPrefix() + ":", "");
        try {
            int userId = Integer.parseInt(userIdStr);
            return userId == 0 ? null : userIdStr;
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format in token: {}", userIdStr);
            return null;
        }
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // 인증 객체 생성
    public Authentication getAuthentication(String token) {
        int userId = Integer.parseInt(getUserIdFromToken(token));
        // UserDetailService에서 userId로 사용자를 조회하는 메서드 필요
        UserDetails userDetails = ((CustomUserDetailsService) userDetailsService).loadUserById(userId);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // HTTP 요청에서 토큰 추출 (Authorization 헤더에서)
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // HTTP 요청에서 리프레시 토큰 추출 (쿠키에서)
    public String resolveRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "refresh_token".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        return null;
    }

    // 토큰 만료 시간 조회 메서드
    public long getAccessTokenExpiration() {
        return jwtProperties.getAccessTokenExpiration();
    }

    public long getRefreshTokenExpiration() {
        return jwtProperties.getRefreshTokenExpiration();
    }
}
