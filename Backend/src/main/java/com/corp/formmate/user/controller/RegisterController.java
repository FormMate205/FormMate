package com.corp.formmate.user.controller;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.dto.RegisterResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.user.service.VerificationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;
    private final JwtTokenService jwtTokenService;
    private final JwtProperties jwtProperties;

    /**
     * 이메일 중복 확인 API
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailAvailability(@RequestParam String email) {
        boolean isAvailable = userService.checkEmailAvailability(email);
        return ResponseEntity.status(HttpStatus.OK).body(isAvailable);
    }

    /**
     * 회원가입 API
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        // 전화번호 정규화
        String normalizedPhone = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 전화번호 인증 여부 확인
        if (!verificationService.isPhoneNumberVerified(normalizedPhone)) {
            throw new UserException(ErrorCode.PHONE_VERIFICATION_FAILED);
        }

        // 회원가입 (사용자 저장)
        UserEntity savedUser = userService.register(request, normalizedPhone);
        log.info("New user registerd: {}", savedUser.getEmail());

        // JWT 토큰 생성
        Token token = jwtTokenService.createTokens(savedUser.getId());

        // Refresh Token을 쿠키에 저장
        jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

        // 응답 생성
        RegisterResponse registerResponse = new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUserName(),
                token.getAccessToken()
        );

        // 응답 반환 (Access Token 포함)
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Authorization", "Bearer " + token.getAccessToken())
                .body(registerResponse);
    }
}
