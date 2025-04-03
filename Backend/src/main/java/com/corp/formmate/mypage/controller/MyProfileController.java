package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.mypage.dto.*;
import com.corp.formmate.mypage.service.MyProfileService;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.service.UserService;
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
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "마이페이지 API", description = "마이페이지 관련 API")
public class MyProfileController {
    private final MyProfileService myProfileService;
    private final UserService userService;

    @Operation(summary = "마이페이지 기본 정보 조회", description = "로그인한 사용자의 기본 프로필 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "프로필 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = BasicProfileResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "userId": 1,
                            "userName": "홍길동",
                            "email": "user@example.com",
                            "phoneNumber": "01012345678"
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없습니다",
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
    @GetMapping("/profile")
    public ResponseEntity<?> selectBasicProfileById(@CurrentUser AuthUser authUser) {
        log.info("마이페이지 기본 정보 조회: userId={}", authUser.getId());
        BasicProfileResponse response = myProfileService.selectBasicProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "마이페이지 상세 정보 조회", description = "로그인한 사용자의 상세 프로필 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "상세 프로필 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DetailProfileResponse.class),
                            examples = @ExampleObject(
                                    value = """
                    {
                        "userName": "홍길동",
                        "phoneNumber": "01012345678",
                        "email": "user@example.com",
                        "provider": "LOCAL"
                    }
                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없습니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @GetMapping("")
    public ResponseEntity<?> selectDetailProfileById(@CurrentUser AuthUser authUser) {
        log.info("마이페이지 상세 정보 조회: userId={}", authUser.getId());
        DetailProfileResponse response = myProfileService.selectDetailProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "사용자 주소 조회", description = "로그인한 사용자의 주소 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "주소 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AddressSearchResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "address": "서울특별시 강남구 테헤란로 123",
                            "addressDetail": "456동 789호"
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "주소 정보를 찾을 수 없습니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 404,
                            "message": "주소 정보를 찾을 수 없습니다",
                            "errors": []
                        }
                        """
                            )
                    )
            )
    })
    @GetMapping("/address")
    public ResponseEntity<?> selectMyAddress(@CurrentUser AuthUser authUser) {
        log.info("사용자 주소 조회: userId={}", authUser.getId());
        AddressSearchResponse response = myProfileService.selectMyAddress(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "사용자 주소 수정", description = "로그인한 사용자의 주소 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "주소 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AddressUpdateResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "address": "서울특별시 강남구 테헤란로 123",
                            "addressDetail": "456동 789호"
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 입력값입니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "timestamp": "2024-01-23T10:00:00",
                            "status": 400,
                            "message": "잘못된 입력값입니다",
                            "errors": [
                                {
                                    "field": "address",
                                    "value": "",
                                    "reason": "주소는 필수 입력 항목입니다."
                                }
                            ]
                        }
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없습니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @PutMapping("/address")
    public ResponseEntity<?> updateMyAddress(
            @CurrentUser AuthUser authUser,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "주소 수정 요청",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AddressUpdateRequest.class))
            )
            @Valid @RequestBody AddressUpdateRequest request) {
        log.info("사용자 주소 수정: userId={}", authUser.getId());
        AddressUpdateResponse response = myProfileService.updateMyAddress(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "비밀번호 수정", description = "로그인한 사용자의 비밀번호를 수정합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "비밀번호 수정 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string"),
                            examples = @ExampleObject(value = "\"비밀번호가 성공적으로 변경되었습니다.\"")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 입력값 또는 비밀번호 불일치",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
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
                                        "field": "newPassword",
                                        "value": "password",
                                        "reason": "비밀번호는 숫자, 영문자, 특수문자를 포함해야 합니다."
                                    }
                                ]
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "현재 비밀번호 불일치",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "현재 비밀번호가 올바르지 않습니다",
                                "errors": []
                            }
                            """
                                    ),
                                    @ExampleObject(
                                            name = "새 비밀번호 불일치",
                                            value = """
                            {
                                "timestamp": "2024-01-23T10:00:00",
                                "status": 400,
                                "message": "새 비밀번호가 일치하지 않습니다",
                                "errors": []
                            }
                            """
                                    )
                            }
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없습니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @PutMapping("/password")
    public ResponseEntity<?> updateMyPassword(
            @CurrentUser AuthUser authUser,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "비밀번호 수정 요청",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordUpdateRequest.class))
            )
            @Valid @RequestBody PasswordUpdateRequest request) {
        log.info("비밀번호 수정: userId={}", authUser.getId());
        myProfileService.updateMyPassword(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body("비밀번호가 성공적으로 변경되었습니다.");
    }
}
