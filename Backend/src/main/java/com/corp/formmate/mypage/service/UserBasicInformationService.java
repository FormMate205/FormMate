package com.corp.formmate.mypage.service;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.mypage.dto.DetailProfileResponse;
import com.corp.formmate.mypage.dto.UserBasicInformationResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserBasicInformationService {

    private final UserService userService;

    /**
     * 로그인 사용자 기본 정보 조회 (이름, 이메일)
     */
    @Transactional(readOnly = true)
    public UserBasicInformationResponse selectLoginUser(Integer userId) {
        try {
            UserEntity user = userService.selectById(userId);

            // 계좌 정보가 모두 존재하면 true, 하나라도 null이면 false
            boolean hasAccount = user.getBankName() != null
                    && user.getAccountNumber() != null
                    && user.getAccountPassword() != null;

            return new UserBasicInformationResponse(
                    userId,
                    user.getUserName(),
                    user.getEmail(),
                    user.isLogged(),
                    hasAccount
            );
        } catch (UserException e) {
            log.error("로그인 사용자 정보 조회 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("로그인 사용자 정보 조회 중 오류: {}", e.getMessage());
            throw new UserException(ErrorCode.USER_NOT_FOUND);
        }
    }
}
