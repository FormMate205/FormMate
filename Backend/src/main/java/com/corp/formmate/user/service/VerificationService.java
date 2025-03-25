package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationService {
    private final RedisTemplate<String, String> redisTemplate;
    private final MessageService messageService;

    // Redis에 저장될 때 사용될 키 접두사
    private static final String VERIFICATION_CODE_PREFIX = "verification:phone:";

    // 인증코드 유효 시간 (5분)
    private static final long CODE_EXPIRATION_TIME = 5 * 60;

    // 인증코드 길이
    private static final int CODE_LENGTH = 6;

    /**
     * 무작위 인증 코드 생성
     * @return 생성된 인증코드
     */
    public String generateCode() {
        try {
            SecureRandom random = new SecureRandom();
            StringBuilder codeBuilder = new StringBuilder();

            for (int i = 0; i < CODE_LENGTH; i++) {
                codeBuilder.append(random.nextInt(10)); // 0~9 사이의 숫자 추가
            }

            return codeBuilder.toString();
        } catch (Exception e) {
            log.error("Failed to generate verification code: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 생성된 인증코드 Redis에 저장
     * @param phoneNumber 전화번호
     * @param code 인증코드
     */
    public void storeCode(String phoneNumber, String code) {
        try {
            String key = VERIFICATION_CODE_PREFIX + phoneNumber;
            redisTemplate.opsForValue().set(key, code, CODE_EXPIRATION_TIME, TimeUnit.SECONDS);
            log.info("Verification code stored for phone number: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to store verification code: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 인증코드 검증
     * @param phoneNumber 전화번호
     * @param code 사용자가 입력한 인증코드
     * @return 검증 결과 (true: 성공, false: 실패)
     */
    public boolean verifyCode(String phoneNumber, String code) {
        try {
            String key = VERIFICATION_CODE_PREFIX + phoneNumber;
            String storedCode = redisTemplate.opsForValue().get(key);

            if (storedCode == null) {
                log.warn("No verification code found for phone number: {}", phoneNumber);
                return false;
            }

            boolean isValid = storedCode.equals(code);

            if (isValid) {
                // 성공 시 인증 코드 삭제 (재사용 방지)
                redisTemplate.delete(key);
                log.info("Verification successful for phone number: {}", phoneNumber);
            } else {
                log.warn("Verification failed for phone number: {}", phoneNumber);
            }

            return isValid;
        } catch (Exception e) {
            log.error("Verification code checking error: {}", e.getMessage());
            return false;
        }

    }

    /**
     * 인증코드 생성과 저장
     * @param phoneNumber 전화번호
     * @return 생성된 인증코드
     */
    public String createAndStoreCode(String phoneNumber) {
        try {
            String code = generateCode();
            storeCode(phoneNumber, code);
            return code;
        } catch (Exception e) {
            log.error("Failed to create and store verification code: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 특정 전화번호에 대한 인증 코드 발급 제한 여부
     * 짧은 시간 내에 너무 많은 요청을 방지하기 위함
     * @param phoneNumber 전화번호
     * @return 제한 여부 (true: 제한됨, false: 제한 없음)
     */
    public boolean isRateLimited(String phoneNumber) {
        try {
            String rateLimitKey = VERIFICATION_CODE_PREFIX + "ratelimit:" + phoneNumber;
            Boolean limited = redisTemplate.hasKey(rateLimitKey);

            if (limited != null && limited) {
                log.warn("Rate limit exceeded for phone number: {}", phoneNumber);
                return true;
            }

            // 1분간 재요청 제한
            redisTemplate.opsForValue().set(rateLimitKey, "1", 1, TimeUnit.MINUTES);
            return false;
        } catch (Exception e){
            log.error("Rate limit check failed: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }


    }

    /**
     * 인증 완료 상태 저장
     * 이후 사용자 등록 과정에서 인증 여부 확인
     * @param phoneNumber 인증된 전화번호
     */
    public void markAsVerified(String phoneNumber) {
        try {
            String verifiedKey = VERIFICATION_CODE_PREFIX + "verified" + phoneNumber;
            // 인증 완료 상태를 30분동안 유지
            redisTemplate.opsForValue().set(verifiedKey, "1", 30, TimeUnit.MINUTES);
            log.info("Phone number marked as verified: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to mark phone number as verified: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 전화번호 인증 완료 여부를 확인
     * @param phoneNumber 전화번호
     * @return 인증 완료 여부
     */
    public boolean isPhoneNumberVerified(String phoneNumber) {
        try {
            String verifiedKey = VERIFICATION_CODE_PREFIX + "verified:" + phoneNumber;
            Boolean verified = redisTemplate.hasKey(verifiedKey);
            return verified != null && verified;
        } catch (Exception e) {
            log.error("Phone verification check failed: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 인증코드 확인 및 전화번호 인증 완료 처리
     */
    public boolean verifyAndMarkPhoneNumber(String phoneNumber, String code) {
        try {
            boolean isValid = verifyCode(phoneNumber, code);

            if (isValid) {
                // 인증 성공 시 해당 전화번호를 인증 완료 상태로 표시
                markAsVerified(phoneNumber);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
        log.error("Verificaiton and marking failed: {}", e.getMessage());
        throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 인증 코드 요청 및 발송 처리
     */
    public boolean requestVerificationCode(String phoneNumber, Boolean preferAlimtalk) {
        try {
            // 1. 전화번호 형식 통일
            String normalizedPhoneNumber = messageService.normalizePhoneNumber(phoneNumber);

            // 2. 요청 제한 확인
            if (isRateLimited(normalizedPhoneNumber)) {
                return false;
            }

            // 3. 인증코드 생성
            String code = createAndStoreCode(normalizedPhoneNumber);

            // 4. 메세지 발송
            boolean messageSent = messageService.sendVerificationCode(
                    normalizedPhoneNumber,
                    code,
                    preferAlimtalk
            );

            // 5. 결과 반환
             if (messageSent) {
                 log.info("Verification successful for phone number: {}", phoneNumber);
                 return true;
             } else {
                 log.error("Failed to send verification code to phone number: {}", normalizedPhoneNumber);
                 throw new UserException(ErrorCode.FAIL_MESSAGE_SEND);
             }

        } catch (UserException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error in verification code request: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
