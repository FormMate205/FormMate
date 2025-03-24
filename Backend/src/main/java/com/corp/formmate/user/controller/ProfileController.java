package com.corp.formmate.user.controller;

import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.user.dto.ProfileCompletionRequest;
import com.corp.formmate.user.dto.ProfileCompletionResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.user.service.VerificationService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 사용자 프로필 관리 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/auth/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;

    /**
     * OAuth2 로그인 후 추가 정보(주소, 전화번호) 입력
     */
    @PostMapping("/complete")
    @Transactional
    public ResponseEntity<?> completeProfile(@Valid @RequestBody ProfileCompletionRequest request) {
        // 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        // 전화번호 정규화
        String normalizedPhone = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 사용자 정보 업데이트
        UserEntity updatedUser = userService.completeProfile(
                email,
                normalizedPhone,
                request.getAddress(),
                request.getAddressDetail()
        );

        // 응답 생성
        ProfileCompletionResponse response = new ProfileCompletionResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getUserName(),
                "프로필이 성공적으로 업데이트 되었습니다."
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
