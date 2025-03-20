package com.corp.formmate.user.controller;

import com.corp.formmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterController {

    private final UserRepository userRepository;

    // 이메일 중복 확인 API
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        boolean isAvailable = !userRepository.existsByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("available", isAvailable));
    }

    // 회원가입 API
//    @PostMapping("/register")

    //
}
