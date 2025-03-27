package com.corp.formmate.mypage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.ContractException;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.mypage.dto.ContractPartnerSearchResponse;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractPartnerService {

	private final UserService userService;

	/**
	 * 계약 상대 조회
	 */
	@Transactional(readOnly = true)
	public ContractPartnerSearchResponse searchContractPartnerByPhoneNumber(String phoneNumber) {
		try {
			UserEntity user = userService.selectByPhoneNumber(phoneNumber);

			return new ContractPartnerSearchResponse(
				user.getId(),
				user.getUserName(),
				user.getPhoneNumber()
			);
		} catch (UserException e) {
			log.error("계약 상대 조회 실패: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("계약 상대 조회 중 오류: {}", e.getMessage());
			throw new ContractException(ErrorCode.USER_NOT_FOUND);
		}
	}

}
