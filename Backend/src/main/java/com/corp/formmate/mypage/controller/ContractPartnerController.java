package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.error.dto.ErrorResponse;
import com.corp.formmate.mypage.dto.ContractPartnerSearchResponse;
import com.corp.formmate.mypage.service.ContractPartnerService;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "계약상대 검색 API", description = "계약상대 검색 관련 API")
public class ContractPartnerController {

    private final ContractPartnerService contractPartnerService;
    private final UserService userService;

    @Operation(summary = "전화번호로 계약상대 조회", description = "전화번호를 통해 계약상대 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "계약상대 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ContractPartnerSearchResponse.class),
                            examples = @ExampleObject(
                                    value = """
                        {
                            "userId": 1,
                            "userName": "홍길동",
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
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 오류가 발생했습니다",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    @GetMapping("/{phoneNumber}")
    public ResponseEntity<?> searchContractPartnerByPhoneNumber(
            @Parameter(description = "조회할 계약상대의 전화번호", required = true, example = "01012345678")
            @PathVariable("phoneNumber") String phoneNumber) {
        log.info("전화번호로 계약상대 조회: {}", phoneNumber);
        ContractPartnerSearchResponse response = contractPartnerService.searchContractPartnerByPhoneNumber(phoneNumber);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
