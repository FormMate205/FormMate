package com.corp.formmate.user.controller;

import com.corp.formmate.user.dto.CodeVerificationRequest;
import com.corp.formmate.user.dto.PhoneVerificationRequest;
import com.corp.formmate.user.service.MessageService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth/verification")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "휴대폰 인증 관련 API")
public class VerificationController {

    private final VerificationService verificationService;
    private final MessageService messageService;

    /**
     * 휴대폰 인증 코드 요청 API
     */
    @Operation(summary = "인증 코드 요청", description = "회원가입 또는 비밀번호 찾기를 위한 휴대폰 인증 코드를 요청합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "인증 코드 발송 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string"),
                            examples = @ExampleObject(value = "\"인증코드가 발송되었습니다.\"")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "올바른 휴대폰 번호 형식이 아닙니다",
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
                            "message": "문자 발송에 실패했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/request")
    public ResponseEntity<String> requestVerification(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "휴대폰 인증 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PhoneVerificationRequest.class))
            )
            @Valid @RequestBody PhoneVerificationRequest request
    ) {
        // 서비스 계층에서 예외 처리 및 결과 반환
        verificationService.requestVerificationCode(request.getPhoneNumber());

        // 성공시 200 OK
        return ResponseEntity.status(HttpStatus.OK).body("인증코드가 발송되었습니다.");
    }

    /**
     * 인증코드 확인 API
     */
    @Operation(summary = "인증 코드 확인", description = "발송된 인증 코드의 유효성을 확인합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "인증 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string"),
                            examples = @ExampleObject(value = "\"인증이 완료되었습니다.\"")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "잘못된 인증 코드",
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
                                            name = "만료된 인증 코드",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "휴대전화 인증이 만료되었습니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            )
    })
    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "인증 코드 확인 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CodeVerificationRequest.class))
            )
            @Valid @RequestBody CodeVerificationRequest request
    ) {
        String phoneNumber = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 인증 검증 (서비스 계층에서 예외 처리)
        verificationService.verifyAndMarkPhoneNumber(phoneNumber, request.getCode());

        return ResponseEntity.status(HttpStatus.OK).body("인증이 완료되었습니다.");
    }
}
