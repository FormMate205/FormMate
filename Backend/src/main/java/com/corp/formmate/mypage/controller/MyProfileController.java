package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.mypage.dto.*;
import com.corp.formmate.mypage.service.MyProfileService;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.service.UserService;
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

    // 마이페이지 전체 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<?> selectBasicProfileById(@CurrentUser AuthUser authUser) {
        BasicProfileResponse response = myProfileService.selectBasicProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 마이페이지 상세 정보 조회
    @GetMapping("")
    public ResponseEntity<?> selectDetailProfileById(@CurrentUser AuthUser authUser) {
        DetailProfileResponse response = myProfileService.selectDetailProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 사용자 주소 조회
    @GetMapping("/address")
    public ResponseEntity<?> selectMyAddress(@CurrentUser AuthUser authUser) {
        AddressSearchResponse response = myProfileService.selectMyAddress(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 사용자 주소 수정
    @PutMapping("/address")
    public ResponseEntity<?> updateMyAddress(@CurrentUser AuthUser authUser, @Valid @RequestBody AddressUpdateRequest request) {
        AddressUpdateResponse response = myProfileService.updateMyAddress(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 비밀번호 수정
    @PutMapping("/password")
    public ResponseEntity<?> updateMyPassword(@CurrentUser AuthUser authUser, @Valid @RequestBody PasswordUpdateRequest request) {
        myProfileService.updateMyPassword(authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body("비밀번호가 성공적으로 변경되었습니다.");
    }
}
