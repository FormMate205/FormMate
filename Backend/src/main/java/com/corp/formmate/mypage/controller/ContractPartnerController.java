package com.corp.formmate.mypage.controller;

import com.corp.formmate.mypage.dto.ContractPartnerSearchResponse;
import com.corp.formmate.mypage.service.ContractPartnerService;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
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

    //계약 상대 조회
    @GetMapping("/{phoneNumber}")
    public ResponseEntity<?> searchContractPartnerByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
        ContractPartnerSearchResponse response = contractPartnerService.searchContractPartnerByPhoneNumber(phoneNumber);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
