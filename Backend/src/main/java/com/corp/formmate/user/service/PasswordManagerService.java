package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.PasswordException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Setter
@Service
@RequiredArgsConstructor
public class PasswordManagerService {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 이름과 전봐번호로 사용자 찾기
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
     * @return 사용자 엔티티
     */
    @Transactional
    public boolean sendPasswordResetVerification(String userName, String phoneNumber) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

            // 사용자 확인
            UserEntity user = selectByNameAndPhone(userName, normalizedPhone);

            // 인증 코드 생성 및 Redis에 저장
            String code = verificationService.createAndStoreCode(normalizedPhone);

            // 인증 코드 전송
            boolean sent = messageService.sendVerificationCode(normalizedPhone, code);

            if (sent) {
                log.info("Password reset verification code sent to: {}", normalizedPhone);
                return true;
            } else {
                log.error("Failed to send verification code to: {}", normalizedPhone);
                throw new PasswordException(ErrorCode.FAIL_MESSAGE_SEND);
            }
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
     * 인증 코드 확인 및 비밀번호 재설정
     * @param phoneNumber 전화번호
     * @param verificationCode 인증 코드
     * @param newPassword 새 비밀번호
     * @param confirmPassword 비밀번화 확인
     * @return 처리 결과
     */
    @Transactional
    public boolean resetPassword(String phoneNumber, String verificationCode, String newPassword, String confirmPassword) {
        try {
            // 전화번호 정규화
            String normalizedPhone = messageService.normalizePhoneNumber(phoneNumber);

            // 비밀번호 일치 확인
            if (!newPassword.equals(confirmPassword)) {
                throw new PasswordException(ErrorCode.PASSWORD_MISMATCH);
            }

            // 인증 코드 확인
            boolean isValid = verificationService.verifyCode(normalizedPhone, verificationCode);
            if (!isValid) {
                throw new PasswordException(ErrorCode.PHONE_VERIFICATION_FAILED);
            }

            // 전화번호로 사용자 찾기
            UserEntity user;
            try {
                user = userService.selectByPhoneNumber(normalizedPhone);
            } catch (UserException e) {
                if (e.getErrorCode() == ErrorCode.USER_NOT_FOUND) {
                    throw new PasswordException(ErrorCode.USER_NOT_FOUND);
                }
                throw e;
            }

            // 비밀번호 업데이트
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.updatePassword(encodedPassword);
            userService.updateUser(user);

            log.info("Password successfully reset for user with phone: {}", normalizedPhone);
            return true;

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
