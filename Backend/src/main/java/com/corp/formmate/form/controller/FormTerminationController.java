package com.corp.formmate.form.controller;

import com.corp.formmate.form.dto.*;
import com.corp.formmate.form.service.FormService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.user.dto.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms/{formId}/termination")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "계약 파기 API", description = "계약 파기 관련 API")
public class FormTerminationController {

    private final FormService formService;

    // 계약 파기 요청
    @Operation(summary = "계약 파기 요청", description = "계약 파기를 요청합니다. 계약 상태가 '진행중'이어야 하며, 계약의 채권자나 채무자만 요청 가능합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "계약 파기 요청 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FormTerminationResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "계약 파기 불가능한 상태",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "현재 폼 상태에서는 파기가 불가능합니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "접근 권한 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 403,
                            "message": "권한이 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "폼을 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @PostMapping("")
    public ResponseEntity<FormTerminationResponse> requestTermination(
            @Parameter(description = "계약 ID", required = true, example = "42")
            @PathVariable("formId") int formId,
            @CurrentUser AuthUser authUser) {
        log.info("계약 파기 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.requestTermination(formId, authUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 계약 파기 첫 번째 서명 인증 요청
    @Operation(summary = "계약 파기 첫 번째 서명 인증 요청", description = "계약 파기를 위한 첫 번째 당사자의 서명 인증을 요청합니다. 계약 상태가 '종료요청' 상태여야 합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "인증 요청 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "boolean", example = "true")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 또는 유효하지 않은 상태",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "유효하지 않은 사용자 정보",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "유효하지 않은 사용자 정보입니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "유효하지 않은 폼 상태",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "잘못된 폼 상태입니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "메시지 발송 실패",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
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
    @PostMapping("/firstSign/verify")
    public ResponseEntity<Boolean> requestFirstSignVerify(
            @Parameter(description = "계약 ID", required = true, example = "42")
            @PathVariable Integer formId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "인증 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = FormTerminationVerifyRequest.class))
            )
            @Valid @RequestBody FormTerminationVerifyRequest request,
            @CurrentUser AuthUser authUser
            ) {
        log.info("계약 파기 첫 번째 서명 인증 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        Boolean result = formService.requestFirstSignVerification(formId, authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 계약 파기 첫 번째 인증
    @Operation(summary = "계약 파기 첫 번째 서명 인증 확인", description = "계약 파기를 위한 첫 번째 당사자의 서명 인증을 확인하고 서명을 완료합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "서명 인증 확인 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FormTerminationResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 또는 인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = {
                                    @ExampleObject(
                                            name = "동의 필요",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "계약 파기에 동의가 필요합니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "인증번호 불일치",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "휴대전화 인증에 실패했습니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @PostMapping("/firstSign/confirm")
    public ResponseEntity<FormTerminationResponse> confirmFirstSignVerification(
            @Parameter(description = "계약 ID", required = true, example = "42")
            @PathVariable Integer formId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "인증 확인 및 서명 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = FormTerminationConfirmRequest.class))
            )
            @Valid @RequestBody FormTerminationConfirmRequest request,
            @CurrentUser AuthUser authUser
            ) {
        log.info("계약 파기 첫 번째 서명 인증 확인 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.confirmFirstSignVerification(formId, authUser.getId(), request.getVerifyRequest(), request.getSignRequest());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 계약 파기 두 번째 서명 인증 요청
    @Operation(summary = "계약 파기 두 번째 서명 인증 요청", description = "계약 파기를 위한 두 번째 당사자의 서명 인증을 요청합니다. 계약 상태가 '종료요청승인' 상태여야 합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "인증 요청 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "boolean", example = "true")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 또는 유효하지 않은 상태",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "메시지 발송 실패",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @PostMapping("/secondSign/verify")
    public ResponseEntity<Boolean> requestSecondSignVerify(
            @Parameter(description = "계약 ID", required = true, example = "42")
            @PathVariable Integer formId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "인증 요청 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = FormTerminationVerifyRequest.class))
            )
            @Valid @RequestBody FormTerminationVerifyRequest request,
            @CurrentUser AuthUser authUser
    ) {
        log.info("계약 파기 두 번째 서명 인증 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        Boolean result = formService.requestSecondSignVerification(formId, authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 계약 파기 두 번째 인증
    @Operation(summary = "계약 파기 두 번째 서명 인증 확인", description = "계약 파기를 위한 두 번째 당사자의 서명 인증을 확인하고 서명을 완료합니다. 이 과정이 완료되면 계약이 종료됩니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "서명 인증 확인 성공 (계약 종료)",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FormTerminationResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 또는 인증 실패",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @PostMapping("/secondSign/confirm")
    public ResponseEntity<FormTerminationResponse> confirmSecondSignVerification(
            @Parameter(description = "계약 ID", required = true, example = "42")
            @PathVariable Integer formId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "인증 확인 및 서명 정보",
                    required = true,
                    content = @Content(schema = @Schema(implementation = FormTerminationConfirmRequest.class))
            )
            @Valid @RequestBody FormTerminationConfirmRequest request,
            @CurrentUser AuthUser authUser
    ) {
        log.info("계약 파기 두 번째 서명 인증 확인 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.confirmSecondSignVerification(formId, authUser.getId(), request.getVerifyRequest(), request.getSignRequest());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
