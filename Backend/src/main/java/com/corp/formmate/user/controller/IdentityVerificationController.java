package com.corp.formmate.user.controller;

import com.corp.formmate.user.dto.IdentityVerificationRequest;
import com.corp.formmate.user.dto.IdentityVerificationResponse;
import com.corp.formmate.user.service.IdentityVerificationService;
import com.corp.formmate.user.service.MessageService;
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
@RequestMapping("/api/auth/identity")
@RequiredArgsConstructor
@Tag(name = "본인인증 API", description = "본인인증 관련 API")
public class IdentityVerificationController {

    private final IdentityVerificationService identityVerificationService;
    private final MessageService messageService;

    /**
     * 본인인증 API
     */
    @Operation(summary = "본인인증", description = "이름, 전화번호, 인증코드, reCAPTCHA로 본인인증을 수행합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "본인인증 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = IdentityVerificationResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "본인인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "인증 코드 오류",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "reCAPTCHA 인증에 실패했습니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "잘못된 사용자 정보",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 404,
                                "message": "사용자를 찾을 수 없습니다",
                                "errors": []
                            }
                            """
                                    )
                            }
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
                            "message": "서버 오류가 발생했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/verify")
    public ResponseEntity<IdentityVerificationResponse> verifyIdentity(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "본인인증 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = IdentityVerificationRequest.class))
            )
          @Valid @RequestBody IdentityVerificationRequest request
    ) {
        log.info("본인인증 요청: name={}, phone={}", request.getUserName(), request.getPhoneNumber());

        // 전화번호 정규화
        String normalizedPhone = messageService.normalizePhoneNumber(request.getPhoneNumber());

        // 본인인증 수행
        IdentityVerificationResponse response = identityVerificationService.verifyIdentity(
                request.getUserName(),
                normalizedPhone,
                request.getVerificationCode(),
                request.getRecaptchaToken()
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
