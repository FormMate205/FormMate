package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.mypage.dto.AccountRegisterRequest;
import com.corp.formmate.mypage.dto.AccountSearchRequest;
import com.corp.formmate.mypage.dto.SearchMyAccountResponse;
import com.corp.formmate.mypage.service.MyAccountService;
import com.corp.formmate.user.dto.AuthUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users/account")
@RequiredArgsConstructor
@Tag(name = "나의 계좌 API", description = "나의 계좌 관련 API")
public class MyAccountController {
    private final MyAccountService myAccountService;

    // 사용자 주소 조회
    @GetMapping("")
    public ResponseEntity<?> selectMyAccount(@CurrentUser AuthUser authUser) {
        SearchMyAccountResponse response = myAccountService.selectMyAccount(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 계좌 정보 입력
    @PostMapping("")
    public ResponseEntity<?> searchAndVerifyMyAccount(@CurrentUser AuthUser authUser,@Valid @RequestBody AccountSearchRequest request) {
        myAccountService.searchAndVerifyMyAccount(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body("존재하는 계좌입니다.");
    }

    // 계좌 등록
    @PutMapping("/register")
    public ResponseEntity<?> registMyAccount(@CurrentUser AuthUser authUser, @Valid @RequestBody AccountRegisterRequest request) {
        myAccountService.registMyAccount(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body("계좌가 등록되었습니다.");
    }

    // 계좌 삭제
    @DeleteMapping("")
    public ResponseEntity<?> deleteMyAccount(@CurrentUser AuthUser authUser) {
        myAccountService.deleteMyAccount(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body("계좌가 삭제되었습니다.");
    }
}
