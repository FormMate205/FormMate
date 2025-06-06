package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.PasswordException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.PasswordResetRequest;
import com.corp.formmate.user.dto.PasswordVerifyRequest;
import com.corp.formmate.user.entity.UserEntity;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Slf4j
@Setter
@Service
public class PasswordManagerService {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<Object, Object> redisTemplate;

    @Autowired
    public PasswordManagerService(
            UserService userService,
            VerificationService verificationService,
            MessageService messageService,
            PasswordEncoder passwordEncoder,
            @Qualifier("objectRedisTemplate") RedisTemplate<Object, Object> redisTemplate) {
        this.userService = userService;
        this.verificationService = verificationService;
        this.messageService = messageService;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
    }

    /**
     * 이름과 전화번호로 사용자 찾기
     * @param userName 사용자 이름
     * @param phoneNumber 전화번호
     * @return 사용자 엔티티
     */
    @Transactional(readOnly = true)
    public UserEntity selectByNameAndPhone(String userName, String phoneNumber) {
        String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

        try {
            return userService.selectByUserNameAndPhoneNumber(userName, normalizedPhone);
        } catch (UserException e) {
            // USER_NOT_FOUND 예외를 PasswordException으로 변환하여 특별히 처리
            if (e.getErrorCode() == ErrorCode.USER_NOT_FOUND) {
                throw new PasswordException(ErrorCode.USER_NOT_FOUND);
            }
            throw e;
        }
    }

    /**
     * 이름과 전화번호로 사용자 찾기
     * @param userName 사용자 이름
     * @param phoneNumber 전화번호
     */
    @Transactional
    public void sendPasswordResetVerification(String userName, String phoneNumber) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

            // 사용자 확인
            UserEntity user = selectByNameAndPhone(userName, normalizedPhone);

            // 인증 코드 생성 및 Redis에 저장
            String code = verificationService.createAndStoreCode(normalizedPhone);

            // 인증 코드 전송
            boolean sent = messageService.sendVerificationCode(normalizedPhone, code);

            if (!sent) {
                log.error("Failed to send verification code to: {}", normalizedPhone);
                throw new PasswordException(ErrorCode.FAIL_MESSAGE_SEND);
            }
            log.info("Password reset verification code sent to: {}", normalizedPhone);
        } catch (PasswordException e) {
            log.error("Password error in verification: {}", e.getMessage());
            throw e;
        } catch (UserException e) {
            log.error("Error in password reset verification: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in password reset verification: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 비밀번호 인증번호 검증
     */
    @Transactional
    public void verifyPhoneAndPassword(PasswordVerifyRequest request) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(request.getPhoneNumber());

            // 인증 코드 확인
            verificationService.verifyCode(normalizedPhone, request.getVerificationCode());

            // 사용자 존재 확인
            try {
                userService.selectByPhoneNumber(normalizedPhone);

                // 인증 성공 시 Redis에 인증 상태 저장 (예: 10분간 유효)
                String verifiedKey = "verified:" + normalizedPhone;
                redisTemplate.opsForValue().set(verificationService.getVerificationKeyPrefix() + verifiedKey, "true", 10, TimeUnit.MINUTES);
                log.debug("인증 상태 저장 - 키: {}", verifiedKey);
            } catch (UserException e) {
                if (e.getErrorCode() == ErrorCode.USER_NOT_FOUND) {
                    throw new PasswordException(ErrorCode.USER_NOT_FOUND);
                }
                throw e;
            }
        } catch (PasswordException e) {
            log.error("Password verification error: {}", e.getMessage());
            throw e; // 예외를 그대로 던져서 컨트롤러에서 처리하도록
        } catch (UserException e) {
            log.error("User error in password verification: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in password verification: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 비밀번호 재설정
     */
    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(request.getPhoneNumber());

            // 인증 상태 확인
            if (!verificationService.isPhoneNumberVerified(normalizedPhone)) {
                throw new PasswordException(ErrorCode.PHONE_VERIFICATION_FAILED);
            }

            // 전화번호로 사용자 착지
            UserEntity user = userService.selectByPhoneNumber(normalizedPhone);

            // 비밀번호 일치 확인
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                throw new PasswordException(ErrorCode.PASSWORD_MISMATCH);
            }

            // 비밀번호 업데이트
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            user.updatePassword(encodedPassword);
            userService.updateUser(user);

            log.info("Password successfully reset for user with phone: {}", normalizedPhone);
        } catch (PasswordException e) {
            log.error("Password error in reset: {}", e.getMessage());
            throw e;
        } catch (UserException e) {
            log.error("User error in password reset: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error in password reset: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
