package com.corp.formmate.mypage.service;

import com.corp.formmate.global.annotation.CurrentUser;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.mypage.dto.BasicProfileResponse;
import com.corp.formmate.mypage.dto.DetailProfileResponse;
import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyProfileService {

    private final UserService userService;

    /**
     * 마이페이지 전체 정보 조회
     */
    @Transactional(readOnly = true)
    public BasicProfileResponse selectBasicProfileById(Integer userId) {
        try {
            UserEntity user = userService.selectById(userId);

            return new BasicProfileResponse(
                    user.getUserName(),
                    user.getPhoneNumber(),
                    user.getEmail(),
                    user.getAddress(),
                    user.getAddressDetail(),
                    user.getProvider()
            );
        } catch (UserException e) {
            log.error("사용자 정보 조회 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("마이페이지 기본 정보 조회 중 오류: {}", e.getMessage());
            throw new RuntimeException("프로필 정보 조회 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 마이페이지 기본 정보 조회 (이름, 전화번호, 이메일)
     */
    @Transactional(readOnly = true)
    public DetailProfileResponse selectDetailProfileById(Integer userId) {
        try {
            UserEntity user = userService.selectById(userId);

            return new DetailProfileResponse(
                    user.getUserName(),
                    user.getPhoneNumber(),
                    user.getEmail(),
                    user.getProvider()
            );
        } catch (UserException e) {
            log.error("사용자 상세 정보 조회 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("마이페이지 상세 정보 조회 중 오류: {}", e.getMessage());
            throw new RuntimeException("프로필 정보 조회 중 오류가 발생했습니다.", e);
        }
    }


}
