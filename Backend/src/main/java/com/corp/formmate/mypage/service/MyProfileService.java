package com.corp.formmate.mypage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.mypage.dto.AddressSearchResponse;
import com.corp.formmate.mypage.dto.AddressUpdateRequest;
import com.corp.formmate.mypage.dto.AddressUpdateResponse;
import com.corp.formmate.mypage.dto.BasicProfileResponse;
import com.corp.formmate.mypage.dto.DetailProfileResponse;
import com.corp.formmate.mypage.dto.PasswordUpdateRequest;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
			throw new UserException(ErrorCode.USER_NOT_FOUND);
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
			throw new UserException(ErrorCode.USER_NOT_FOUND);
		}
	}

	/**
	 * 주소 조회
	 */
	public AddressSearchResponse selectMyAddress(Integer userId) {
		try {
			UserEntity user = userService.selectById(userId);

			return new AddressSearchResponse(
				user.getAddress(),
				user.getAddressDetail()
			);
		} catch (UserException e) {
			log.error("사용자 주소 조회 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("사용자 주소 조회 조회 중 오류: {}", e.getMessage());
			throw new UserException(ErrorCode.ADDRESS_NOT_FOUND);
		}
	}

	/**
	 * 주소 수정
	 */
	public AddressUpdateResponse updateMyAddress(Integer userId, AddressUpdateRequest request) {
		try {
			// 사용자 조회
			UserEntity user = userService.selectById(userId);

			// 주소 업데이트
			user.updateAddress(request.getAddress(), request.getAddressDetail());

			// 변경사항 저장
			userService.updateUser(user);

			// 응답 생성
			return new AddressUpdateResponse(
				user.getAddress(),
				user.getAddressDetail()
			);
		} catch (UserException e) {
			log.error("사용자 주소 수정 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("사용자 주소 업데이트 중 오류: {}", e.getMessage());
			throw new UserException(ErrorCode.ADDRESS_NOT_FOUND);
		}
	}

	/**
	 * 비밀번호 수정
	 */
	@Transactional
	public void updateMyPassword(Integer userId, PasswordUpdateRequest request) {
		try {
			// 현재 비밀번호 확인
			if (!userService.verifyPassword(userId, request.getPassword())) {
				throw new UserException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
			}

			// 새 비밀번호와 확인 비밀번호 일치 여부 확인
			if (!request.getNewPassword().equals(request.getConfirmPassword())) {
				throw new UserException(ErrorCode.PASSWORD_MISMATCH);
			}

			// 새 비밀번호로 업데이트
			userService.updatePassword(userId, request.getNewPassword());
			log.info("비밀번호가 성공적으로 업데이트되었습니다. 사용자 ID:: {}", userId);
		} catch (UserException e) {
			log.error("사용자 비밀번호 수정 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("사용자 비밀번호 수정 중 오류: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}
}
