package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.support.PropertiesLoaderSupport;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PropertiesLoaderSupport propertiesLoaderSupport;

    /**
     * 이메일로 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserEntity selectByEmail(String email) {
        try {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
        } catch (Exception e) {
            log.error("User search by email failed: {}", e.getMessage());
            throw new UserException(ErrorCode.USER_SEARCH_ERROR);
        }

    }

    /**
     * ID로 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserEntity selectById(int id) {
        try {
            return userRepository.findById(id)
                    .orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
        } catch (Exception e) {
            log.error("User search by id failed: {}", e.getMessage());
            throw new UserException(ErrorCode.USER_SEARCH_ERROR);
        }

    }

    /**
     * 이메일 중복 확인
     * @param email 확인할 이메일
     * @return 사용 가능 여부 (true: 사용 가능, false: 이미 사용 중)
     */
    @Transactional(readOnly = true)
    public boolean checkEmailAvailability(String email) {
        return !userRepository.existsByEmail(email);
    }

    /**
     * 회원가입
     * @param request 회원가입 요청 정보
     * @return 저장된 사용자 엔티티
     */
    @Transactional
    public UserEntity register(RegisterRequest request, String normalizedPhone) {
        try {
            // 이메일 중복 확인
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserException(ErrorCode.EMAIL_DUPLICATE);
            }

            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(request.getPassword());

            // 사용자 엔티티 생성
            UserEntity user = UserEntity.builder()
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .userName(request.getUserName())
                    .phoneNumber(normalizedPhone)
                    .address(request.getAddress())
                    .addressDetail(request.getAddressDetail())
                    .provider(request.getProvider())
                    .role(Role.USER)
                    .status(true)
                    .build();

            // 사용자 저장 및 반환
            return userRepository.save(user);
        } catch (UserException e) {
            // 이미 UserException이면 그대로 throw
            throw e;
        } catch (Exception e) {
            log.error("User register failed: {}", e.getMessage());
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * OAuth2 사용자 정보로 사용자 조회 또는 생성
     * @param userInfo OAuth2 사용자 정보
     * @param provider 인증 제공자
     * @return 사용자 엔티티
     */
    @Transactional
    public UserEntity getOrCreateOAuth2User(OAuth2UserInfo userInfo, Provider provider) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(userInfo.getEmail());

        if (existingUser.isPresent()) {
            // 이미 가입된 경우, 필요에 따라 정보 업데이트 가능
            return existingUser.get();
        } else {
            // 신규 회원인 경우, OAuth 정보로 가입 처리
            UserEntity newUser = UserEntity.builder()
                    .email(userInfo.getEmail())
                    .userName(userInfo.getName())
                    .provider(provider)
                    .role(Role.USER)
                    .status(true)
                    .build();

            return userRepository.save(newUser);
        }
    }

    @Transactional
    public UserEntity completeProfile(String email, String phoneNumber, String address, String addressDetail) {
        UserEntity user = selectByEmail(email);

        // 사용자 정보 업데이트
        user.updateAdditionalProfile(phoneNumber, address, addressDetail);

        return user;
    }

}
