package com.corp.formmate.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestRedirectController {

    @GetMapping("/complete-profile")
    public ResponseEntity<String> completeProfile(@RequestParam(required = false) String token) {
        return ResponseEntity.ok("OAuth2 로그인 후 추가 정보 입력 페이지입니다. 토큰: " + token);
    }

    @GetMapping("/")
    public ResponseEntity<String> mainPage(@RequestParam(required = false) String token) {
        return ResponseEntity.ok("메인 페이지입니다. 토큰: " + (token != null ? token : "없음"));
    }
}
