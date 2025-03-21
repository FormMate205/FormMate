package com.corp.formmate.user.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 이메일로 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserEntity selectByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    /**
     * ID로 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserEntity selectById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
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
    }

}
