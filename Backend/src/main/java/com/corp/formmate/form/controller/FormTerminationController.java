package com.corp.formmate.form.controller;

import com.corp.formmate.form.dto.*;
import com.corp.formmate.form.service.FormService;
import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.user.dto.AuthUser;
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
    @PostMapping("")
    public ResponseEntity<FormTerminationResponse> requestTermination(
            @PathVariable("formId") int formId,
            @CurrentUser AuthUser authUser) {
        log.info("계약 파기 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.requestTermination(formId, authUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 계약 파기 첫 번째 서명 인증 요청
    @PostMapping("/firstSign/verify")
    public ResponseEntity<Boolean> requestFirstSignVerify(
            @PathVariable Integer formId,
            @Valid @RequestBody FormTerminationVerifyRequest request,
            @CurrentUser AuthUser authUser
            ) {
        log.info("계약 파기 첫 번째 서명 인증 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        Boolean result = formService.requestFirstSignVerification(formId, authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 계약 파기 첫 번째 인증
    @PostMapping("/firstSign/confirm")
    public ResponseEntity<FormTerminationResponse> confirmFirstSignVerification(
            @PathVariable Integer formId,
            @Valid @RequestBody FormTerminationConfirmRequest request,
            @CurrentUser AuthUser authUser
            ) {
        log.info("계약 파기 첫 번째 서명 인증 확인 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.confirmFirstSignVerification(formId, authUser.getId(), request.getVerifyRequest(), request.getSignRequest());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 계약 파기 두 번째 서명 인증 요청
    @PostMapping("/secondSign/verify")
    public ResponseEntity<Boolean> requestSecondSignVerify(
            @PathVariable Integer formId,
            @Valid @RequestBody FormTerminationVerifyRequest request,
            @CurrentUser AuthUser authUser
    ) {
        log.info("계약 파기 두 번째 서명 인증 요청 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        Boolean result = formService.requestSecondSignVerification(formId, authUser.getId(), request);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 계약 파기 두 번째 인증
    @PostMapping("/secondSign/confirm")
    public ResponseEntity<FormTerminationResponse> confirmSecondSignVerification(
            @PathVariable Integer formId,
            @Valid @RequestBody FormTerminationConfirmRequest request,
            @CurrentUser AuthUser authUser
    ) {
        log.info("계약 파기 두 번째 서명 인증 확인 - 계약 ID: {}, 요청자: {}", formId, authUser.getId());
        FormTerminationResponse response = formService.confirmSecondSignVerification(formId, authUser.getId(), request.getVerifyRequest(), request.getSignRequest());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
