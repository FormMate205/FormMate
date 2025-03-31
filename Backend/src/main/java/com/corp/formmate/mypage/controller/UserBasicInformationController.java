package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.mypage.dto.DetailProfileResponse;
import com.corp.formmate.mypage.dto.UserBasicInformationResponse;
import com.corp.formmate.mypage.service.UserBasicInformationService;
import com.corp.formmate.user.dto.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "로그인 사용자 정보 API", description = "로그인 사용자 정보 관련 API")
public class UserBasicInformationController {

    private final UserBasicInformationService userBasicInformationService;

    @Operation(
            summary = "로그인 사용자 기본 정보 조회",
            description = "현재 로그인한 사용자의 기본 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "사용자 정보 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserBasicInformationResponse.class),
                            examples = @ExampleObject(
                                    value = """
                    {
                        "userName": "홍길동",
                        "email": "user@example.com",
                        "hasAccount": true
                    }
                """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 접근",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                    {
                        "timestamp": "2024-03-28T14:00:00",
                        "status": 401,
                        "message": "인증되지 않은 접근입니다",
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
                        "timestamp": "2024-03-28T14:00:00",
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
                        "timestamp": "2024-03-28T14:00:00",
                        "status": 500,
                        "message": "사용자 정보 조회 중 오류가 발생했습니다",
                        "errors": []
                    }
                """
                            )
                    )
            )
    })
    @GetMapping("/basic")
    public ResponseEntity<?> selectLoginUser(@CurrentUser AuthUser authUser) {
        log.info("로그인 사용자 정보 조회: userId={}", authUser.getId());
        UserBasicInformationResponse response = userBasicInformationService.selectLoginUser(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
