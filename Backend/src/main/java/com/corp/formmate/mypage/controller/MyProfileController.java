package com.corp.formmate.mypage.controller;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.mypage.dto.BasicProfileResponse;
import com.corp.formmate.mypage.dto.DetailProfileResponse;
import com.corp.formmate.mypage.service.MyProfileService;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.service.UserService;
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
@Tag(name = "마이페이지 API", description = "마이페이지 관련 API")
public class MyProfileController {
    private final MyProfileService myProfileService;
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> selectBasicProfileById(@CurrentUser AuthUser authUser) {
        BasicProfileResponse response = myProfileService.selectBasicProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("")
    public ResponseEntity<?> selectDetailProfileById(@CurrentUser AuthUser authUser) {
        DetailProfileResponse response = myProfileService.selectDetailProfileById(authUser.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
