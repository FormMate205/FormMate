package com.corp.formmate.user.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.dto.PasswordFindRequest;
import com.corp.formmate.user.dto.PasswordResetRequest;
import com.corp.formmate.user.dto.PasswordVerifyRequest;
import com.corp.formmate.user.service.PasswordManagerService;
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
@RequestMapping("/api/auth/paswword")
@RequiredArgsConstructor
@Tag(name = "비밀번호 관리 API", description = "비밀번호 찾기 및 재설정 관련 API")
public class PasswordController {

    private final PasswordManagerService passwordManagerService;

    /**
     * 비밀번호 찾기 요청 (인증번호 발송)
     */
    @Operation(summary = "비밀번호 찾기", description = "이름과 전화번호로 사용자 확인 후 비밀번호 재설정을 위한 인증 코드를 발송합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "인증 코드 발송 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string"),
                            examples = @ExampleObject(value = "\"비밀번호 재설정 인증번호가 전송되었습니다.\"")
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
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "사용자를 찾을 수 없습니다",
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
    @PostMapping("/find")
    public ResponseEntity<String> findPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "비밀번호 찾기 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordFindRequest.class))
            )
            @Valid @RequestBody PasswordFindRequest request) {
        passwordManagerService.sendPasswordResetVerification(
                    request.getUserName(),
                    request.getPhoneNumber()
        );

        return ResponseEntity.status(HttpStatus.OK).body("비밀번호 재설정 인증번호가 전송되었습니다.");
    }

    /**
     * 비밀번호 인증번호 확인
     */
    @Operation(summary = "인증번호 확인", description = "비밀번호 재설정을 위한 인증번호를 확인합니다.")
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
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "휴대전화 인증에 실패했습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "사용자를 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPhoneAndPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "비밀번호 인증번호 확인 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordVerifyRequest.class))
            )
            @Valid @RequestBody PasswordVerifyRequest request) {
        passwordManagerService.verifyPhoneAndPassword(request);

        return ResponseEntity.status(HttpStatus.OK).body("인증이 완료되었습니다.");
    }

    /**
     * 새 비밀번호 설정
     */
    @Operation(summary = "비밀번호 재설정", description = "인증된 사용자의 비밀번호를 재설정합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "비밀번호 재설정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string"),
                            examples = @ExampleObject(value = "\"비밀번호가 성공적으로 재설정되었습니다.\"")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "비밀번호 불일치",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "새 비밀번호가 일치하지 않습니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "인증되지 않은 요청",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "휴대전화 인증이 필요합니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "사용자를 찾을 수 없습니다",
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
                            schema = @Schema(implementation = ErrorResponse.class),
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
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "비밀번호 재설정 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordResetRequest.class))
            )
            @Valid @RequestBody PasswordResetRequest request) {
        passwordManagerService.resetPassword(request);
        return ResponseEntity.status(HttpStatus.OK).body("비밀번호가 성공적으로 재설정되었습니다.");
    }
}
