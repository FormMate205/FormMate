package com.corp.formmate.jwt.repository;

import com.corp.formmate.jwt.properties.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtProperties jwtProperties;

    private static final String KEY_PREFIX = "refreshToken:";

    /**
     * Refresh Token을 Redis에 저장
     * @param userId 사용자 ID
     * @param refreshToken Refresh Token
     */
    public void saveRefreshToken(String userId, String refreshToken) {
        String key = KEY_PREFIX + userId;

        // TTL을 설정하여 토큰 만료 시간과 동일하게 설정
        redisTemplate.opsForValue().set(key, refreshToken,
                jwtProperties.getRefreshTokenExpiration(), TimeUnit.MILLISECONDS);
    }

    /**
     * Redis에서 Refresh Token 조회
     * @param userId 사용자 ID
     * @return Refresh Token
     */
    public String findRefreshToken(String userId) {
        String key = KEY_PREFIX + userId;
        return redisTemplate.opsForValue().get(key);
    }

    /**
     * Redis에서 Refresh Token 삭제 (로그아웃 시 사용)
     * @param userId 사용자 ID
     */
    public void deleteRefreshToken(String userId) {
        String key = KEY_PREFIX + userId;
        redisTemplate.delete(key);
    }
}
