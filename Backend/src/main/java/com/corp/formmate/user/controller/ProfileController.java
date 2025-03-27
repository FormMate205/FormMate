package com.corp.formmate.user.controller;

import com.corp.formmate.user.dto.ProfileCompletionRequest;
import com.corp.formmate.user.dto.ProfileCompletionResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.user.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import org.springframework.web.bind.annotation.RequestBody;
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
@Tag(name = "프로필 API", description = "프로필 관리 관련 API")
public class ProfileController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;

    /**
     * OAuth2 로그인 후 추가 정보(주소, 전화번호) 입력
     */
    @Operation(summary = "프로필 업데이트", description = "OAuth2 로그인 후 필요한 추가 정보(주소, 전화번호)를 입력합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "프로필 업데이트 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ProfileCompletionResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 또는 인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "휴대폰 인증 실패",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "휴대전화 인증에 실패했습니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "잘못된 입력값",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "잘못된 입력값입니다",
                                "errors": [
                                    {
                                        "field": "phoneNumber",
                                        "value": "010-123",
                                        "reason": "올바른 휴대폰 번호 형식이 아닙니다"
                                    }
                                ]
                            }
                            """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 401,
                            "message": "인증되지 않은 접근입니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 500,
                            "message": "프로필 업데이트 중 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/complete")
    @Transactional
    public ResponseEntity<?> completeProfile(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "프로필 업데이트 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ProfileCompletionRequest.class))
            )
            @Valid @RequestBody ProfileCompletionRequest request) {
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
                updatedUser.getUserName()
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
