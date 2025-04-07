package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.user.dto.IdentityVerificationResponse;
import com.corp.formmate.user.entity.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class IdentityVerificationService {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final RestTemplate restTemplate;

    @Autowired
    public IdentityVerificationService(
            UserService userService,
            VerificationService verificationService,
            MessageService messageService,
            JwtTokenProvider jwtTokenProvider,
            // 여기에 @Qualifier 추가
            @Qualifier("customStringRedisTemplate") RedisTemplate<String, String> redisTemplate,
            RestTemplate restTemplate) {
        this.userService = userService;
        this.verificationService = verificationService;
        this.messageService = messageService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisTemplate = redisTemplate;
        this.restTemplate = restTemplate;
    }

    @Value("${recaptcha.secret.key}")
    private String recaptchaSecretKey;

    // 본인인증 토큰 유효기간 (30분)
    private static final long IDENTITY_VERIFICATION_EXPIRATION = 30 * 60;

    // Redis에 저장될 키 접두사
    private static final String IDENTITY_VERIFICATION_PREFIX = "identity:verified:";

    /**
     * 본인인증 수행
     * @param userName 사용자 이름
     * @param phoneNumber 전화번호
     * @param verificationCode 인증 코드
     * @param recaptchaToken reCAPTCHA 토큰
     * @return 인증 결과 DTO
     */
    @Transactional
    public IdentityVerificationResponse verifyIdentity(String userName, String phoneNumber, String verificationCode, String recaptchaToken) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

            // reCAPTCHA 검증
            boolean recaptchaValid = verifyRecaptcha(recaptchaToken);
            if (!recaptchaValid) {
                log.warn("reCAPTCHA verification failed for user: {}, phone: {}", userName, normalizedPhone);
                throw new UserException(ErrorCode.INVALID_CAPTCHA);
            }

            // SMS 인증코드 검증
            verificationService.verifyCode(normalizedPhone, verificationCode);

            // 사용자 정보 확인 (이름과 전화번호로 조회)
            UserEntity user = userService.selectByUserNameAndPhoneNumber(userName, normalizedPhone);

            // 본인인증 완료 상태 저장 및 토큰 발급
            String identityToken = createIdentityToken(user.getId());
            markIdentityVerified(user.getId());

            log.info("Identity verification successful for user: {}, phone: {}", userName, normalizedPhone);

            return new IdentityVerificationResponse(
                    true,
                    identityToken
            );
        } catch (UserException e) {
            log.error("Identity verificatio failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in identity verification: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 임시 본인인증 토큰 생성
     */
    private String createIdentityToken(Integer userId) {
        return jwtTokenProvider.createTemporaryToken(userId);
    }

    /**
     * 본인인증 완료 상태 저장
     */
    private void markIdentityVerified(Integer userId) {
        String key = IDENTITY_VERIFICATION_PREFIX + userId;
        redisTemplate.opsForValue().set(key, "verified", IDENTITY_VERIFICATION_EXPIRATION, TimeUnit.SECONDS);
        log.info("User marked as identity verified: {}", userId);
    }

    /**
     * 본인인증 완료 여부 확인
     */
    public boolean isIdentityVerified(Integer userId) {
        String key = IDENTITY_VERIFICATION_PREFIX + userId;
        Boolean verified = redisTemplate.hasKey(key);
        return verified != null && verified;
    }

    /**
     * reCAPTCHA 토큰 검증
     */
    private boolean verifyRecaptcha(String recaptchaToken) {
        try {
            String url = "https://www.google.com/recaptcha/api/siteverify";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("secret", recaptchaSecretKey);
            map.add("response", recaptchaToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            if (response == null) {
                return false;
            }

            return (Boolean) response.get("success");
        } catch (Exception e) {
            log.error("reCAPTCHA verification failed: {}", e.getMessage());
            return false;
        }
    }
}
