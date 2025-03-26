package com.corp.formmate.user.controller;

import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.UserService;
import com.corp.formmate.user.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "회원가입 API", description = "회원가입 및 이메일 중복 확인 관련 API")
public class RegisterController {

    private final UserService userService;
    private final VerificationService verificationService;
    private final MessageService messageService;
    private final JwtTokenService jwtTokenService;
    private final JwtProperties jwtProperties;

    /**
     * 이메일 중복 확인 API
     */
    @Operation(summary = "이메일 중복 확인", description = "회원가입 시 이메일 중복 여부를 확인합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "이메일 사용 가능 여부 확인 결과",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "boolean"),
                            examples = @ExampleObject(value = "true")
                    )
            )
    })
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailAvailability(
            @Parameter(description = "확인할 이메일", required = true, example = "user@example.com")
            @RequestParam String email) {
        boolean isAvailable = userService.checkEmailAvailability(email);
        return ResponseEntity.status(HttpStatus.OK).body(isAvailable);
    }

    /**
     * 회원가입 API
     */
    @Operation(summary = "회원가입", description = "새 사용자를 등록합니다. 휴대폰 인증이 필요합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "회원가입 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 입력값 또는 휴대폰 인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "유효성 검증 실패",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "잘못된 입력값입니다",
                                "errors": [
                                    {
                                        "field": "email",
                                        "value": "invalid-email",
                                        "reason": "올바른 이메일 형식이 아닙니다"
                                    }
                                ]
                            }
                            """
                                    ),
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
                                            name = "이메일 중복",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "이미 존재하는 이메일입니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            )
    })
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "회원가입 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = RegisterRequest.class))
            )
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        String accessToken = userService.registerAndCreateToken(request, response);

        // 응답 반환 (Access Token 포함)
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Authorization", "Bearer " + accessToken)
                .body("회원가입이 완료되었습니다.");
    }
}
