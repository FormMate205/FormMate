package com.corp.formmate.jwt.controller;

import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.dto.LoginRequest;
import com.corp.formmate.user.dto.LoginResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "로그인, 로그아웃, 토큰 갱신 관련 API")
public class AuthController {

    private final JwtTokenService jwtTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtProperties jwtProperties;

    /**
     * 로그인 API
     */
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "로그인 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "로그인 실패 - 인증 오류",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 401,
                            "message": "이메일 또는 비밀번호가 일치하지 않습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 입력값",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "잘못된 입력값입니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/email/login")
    public ResponseEntity<?> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "로그인 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = LoginRequest.class))
            )
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        // Spring Security의 인증 매커니즘을 사용하여 사용자 인증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // 인증 정보를 SecurityContext에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 사용자 정보 조회
        UserEntity user = userService.selectByEmail(loginRequest.getEmail());

        // 토큰 생성
        Token token = jwtTokenService.createTokens(user.getId());

        // Refresh Token을 쿠키에 저장
        jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

        // 응답 객체 생성
        LoginResponse loginResponse = new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getUserName()
        );

        // Header에 Access Token 포함
        return ResponseEntity.status(HttpStatus.OK)
                .header("Authorization", "Bearer " + token.getAccessToken())
                .body(loginResponse);

    }

    /**
     * 토큰 갱신 API
     */
    @Operation(summary = "토큰 갱신", description = "Refresh Token을 이용해 Access Token을 갱신합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "토큰 갱신 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            "message": "Token refreshed successfully"
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "토큰 갱신 실패 - 유효하지 않은 토큰",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 401,
                            "message": "유효하지 않은 토큰입니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "토큰 갱신 실패 - 리프레시 토큰을 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "리프레시 토큰을 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 Refresh Token 추출
        String refreshToken = jwtTokenProvider.resolveRefreshToken(request);

        // 토큰 갱신
        Token token = jwtTokenService.refreshToken(refreshToken);

        // 새로운 Refresh Token을 쿠키에 설정
        jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

        // Header에 새로운 Access Token 포함
        return ResponseEntity.status(HttpStatus.OK)
                .header("Authorization", "Bearer " + token.getAccessToken())
                .body("Token refreshed successfully");
    }

    /**
     * 로그아웃 API
     */
    @Operation(summary = "로그아웃", description = "현재 로그인된 사용자를 로그아웃처리합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "로그아웃 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "message": "Logged out successfully"
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "로그아웃 실패 - 인증되지 않은 사용자",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 401,
                            "message": "인증되지 않은 사용자입니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "로그아웃 실패 - 서버 오류",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 500,
                            "message": "로그아웃 처리 중 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Access Token에서 사용자 ID 추출
        String token = jwtTokenProvider.resolveToken(request);

        // 로그아웃 처리 (에러 발생시 서비스 계층에서 예외 발생)
        jwtTokenService.logout(token, authentication, response);

        return ResponseEntity.status(HttpStatus.OK).body("Logged out successfully");
    }
}
