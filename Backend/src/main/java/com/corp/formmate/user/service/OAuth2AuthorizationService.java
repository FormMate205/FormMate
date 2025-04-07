package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.AuthException;
import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.service.JwtTokenService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class OAuth2AuthorizationService {
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtTokenService jwtTokenService;

    @Autowired
    public OAuth2AuthorizationService(
            @Qualifier("customStringRedisTemplate") RedisTemplate<String, String> redisTemplate,
            JwtTokenService jwtTokenService) {
        this.redisTemplate = redisTemplate;
        this.jwtTokenService = jwtTokenService;
    }

    // 인증 코드 유효 시간 (5분)
    private static final long AUTH_CODE_EXPIRATION = 5 * 60;

    // 일회용 인증 코드 생성 (인가 코드)
    public String generateAuthorizationCode(Integer userId) {
        String authCode = UUID.randomUUID().toString();
        // Redis에 인증 코드와 사용자 ID 매핑 저장 (5분 유효)
        redisTemplate.opsForValue().set("auth_code:" + authCode, userId.toString(), AUTH_CODE_EXPIRATION, TimeUnit.SECONDS);

        log.info("Generated auth code for user ID: {}", userId);
        return authCode;
    }

    // 인증 코드로 토큰 발급
    public Token exchangeCodeForToken(String authCode) {
        String key = "auth_code:" + authCode;
        String userIdStr = redisTemplate.opsForValue().get(key);

        if (userIdStr == null) {
            throw new AuthException(ErrorCode.INVALID_TOKEN);
        }

        // 인증 코드는 1회용이므로 사용 후 삭제
        redisTemplate.delete(key);

        try {
            // 토큰 발급
            Integer userId = Integer.parseInt(userIdStr);
            return jwtTokenService.createTokens(userId);
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format: {}", userIdStr);
            throw new AuthException(ErrorCode.INVALID_TOKEN);
        } catch (Exception e) {
            log.error("Token creation failed: {}", e.getMessage());
            throw new AuthException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }


}
