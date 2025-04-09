package com.corp.formmate.user.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final VerificationService verificationService;
	private final FcmTokenService fcmTokenService;
	private final MessageService messageService;
	private final JwtProperties jwtProperties;

	/**
	 * 이메일로 사용자 정보 조회
	 */
	@Transactional(readOnly = true)
	public UserEntity selectByEmail(String email) {
		try {
			return userRepository.findByEmail(email)
				.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User search by email failed: {}", e.getMessage());
			throw new UserException(ErrorCode.USER_SEARCH_ERROR);
		}
	}

	/**
	 * ID로 사용자 정보 조회
	 */
	@Transactional(readOnly = true)
	public UserEntity selectById(int id) {
		try {
			return userRepository.findById(id)
				.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User search by id failed: {}", e.getMessage());
			throw new UserException(ErrorCode.USER_SEARCH_ERROR);
		}

	}

	/**
	 * 이메일 중복 확인
	 * @param email 확인할 이메일
	 * @return 사용 가능 여부 (true: 사용 가능, false: 이미 사용 중)
	 */
	@Transactional(readOnly = true)
	public boolean checkEmailAvailability(String email) {
		try {
			return !userRepository.existsByEmail(email);
		} catch (Exception e) {
			log.error("Email check failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 전화번호 중복 확인
	 * @param phoneNumber 확인할 전화번호
	 * @return 사용 가능 여부 (true: 사용 가능, false: 이미 사용 중)
	 */
	@Transactional(readOnly = true)
	public boolean checkPhoneNumberAvailability(String phoneNumber) {
		try {
			return !userRepository.existsByPhoneNumber(phoneNumber);
		} catch (Exception e) {
			log.error("Phone number check failed: {}", e.getMessage());
			throw new UserException(ErrorCode.PHONE_ALREADY_REGISTERED);
		}
	}

	/**
	 * 회원가입 (전화번호 인증 검증 포함)
	 */
	@Transactional
	public UserEntity registerWithPhoneVerification(RegisterRequest request, String normalizedPhone) {
		try {
			// 전화번호 인증 여부 확인
			if (!verificationService.isPhoneNumberVerified(normalizedPhone)) {
				throw new UserException(ErrorCode.PHONE_VERIFICATION_FAILED);
			}

			// 이메일 중복 확인
			if (checkEmailAvailability(request.getEmail())) {
				throw new UserException(ErrorCode.EMAIL_DUPLICATE);
			}

			// 전화번호 중복 확인
			if (checkPhoneNumberAvailability(normalizedPhone)) {
				throw new UserException(ErrorCode.PHONE_ALREADY_REGISTERED);
			}

			// 회원가입 진행
			return register(request, normalizedPhone);

		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("Registration with phone verification failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 회원가입
	 * @param request 회원가입 요청 정보
	 * @return 저장된 사용자 엔티티
	 */
	@Transactional
	public UserEntity register(RegisterRequest request, String normalizedPhone) {
		try {
			//            // 이메일 중복 확인
			//            if (checkEmailAvailability(request.getEmail())) {
			//                throw new UserException(ErrorCode.EMAIL_DUPLICATE);
			//            }
			//
			//            // 전화번호 중복 확인
			//            if (checkPhoneNumberAvailability(normalizedPhone)) {
			//                throw new UserException(ErrorCode.PHONE_ALREADY_REGISTERED);
			//            }

			// 이메일 중복 확인 (로깅 추가)
			String email = request.getEmail();
			boolean emailExists = userRepository.existsByEmail(email);
			log.debug("Email check: '{}' exists: {}", email, emailExists);

			if (emailExists) {
				throw new UserException(ErrorCode.EMAIL_DUPLICATE);
			}

			// 전화번호 중복 확인 (로깅 추가)
			boolean phoneExists = userRepository.existsByPhoneNumber(normalizedPhone);
			log.debug("Phone check: '{}' exists: {}", normalizedPhone, phoneExists);

			if (phoneExists) {
				throw new UserException(ErrorCode.PHONE_ALREADY_REGISTERED);
			}

			// 비밀번호 암호화
			String encodedPassword = passwordEncoder.encode(request.getPassword());

			// 사용자 엔티티 생성
			UserEntity user = UserEntity.builder()
				.email(request.getEmail())
				.password(encodedPassword)
				.userName(request.getUserName())
				.phoneNumber(normalizedPhone)
				.address(request.getAddress())
				.addressDetail(request.getAddressDetail())
				.provider(request.getProvider())
				.role(Role.USER)
				.status(true)
				.build();

			userRepository.save(user);
			fcmTokenService.register(user);

			// 사용자 저장 및 반환
			return user;
		} catch (UserException e) {
			// 이미 UserException이면 그대로 throw
			throw e;
		} catch (Exception e) {
			log.error("User register failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * registerWithPhoneVerification: 전화번호 인증 확인 및 사용자 등록
	 * register: 실제 사용자 데이터 저장
	 */

	/**
	 * OAuth2 사용자 정보로 사용자 조회 또는 생성
	 * @param userInfo OAuth2 사용자 정보
	 * @param provider 인증 제공자
	 * @return 사용자 엔티티
	 */
	@Transactional
	public UserEntity getOrCreateOAuth2User(OAuth2UserInfo userInfo, Provider provider) {
		try {
			Optional<UserEntity> existingUser = userRepository.findByEmail(userInfo.getEmail());

			if (existingUser.isPresent()) {
				// 이미 가입된 경우, 필요에 따라 정보 업데이트 가능
				return existingUser.get();
			} else {
				// 신규 회원인 경우, OAuth 정보로 가입 처리
				UserEntity newUser = UserEntity.builder()
					.email(userInfo.getEmail())
					.userName(userInfo.getName())
					.provider(provider)
					.role(Role.USER)
					.status(true)
					.build();

				userRepository.save(newUser);
				fcmTokenService.register(newUser);

				return newUser;
			}
		} catch (Exception e) {
			log.error("OAuth2 user createion failed: {}", e.getMessage(), e);
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

	}

	/**
	 * OAuth2 로그인 후 추가 정보 확인
	 */
	@Transactional
	public UserEntity completeProfile(String email, String phoneNumber, String address, String addressDetail) {
		try {
			UserEntity user = selectByEmail(email);

			// 전화번호 인증 여부 확인
			if (!verificationService.isPhoneNumberVerified(phoneNumber)) {
				throw new UserException(ErrorCode.PHONE_VERIFICATION_FAILED);
			}

			// 사용자 정보 업데이트
			user.updateAdditionalProfile(phoneNumber, address, addressDetail);

			return user;
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("Profile completion failed: {}", e.getMessage());
			throw new UserException(ErrorCode.PROFILE_UPDATE_ERROR);
		}
	}

	/**
	 * 이름과 전화번호로 사용자 찾기
	 * @param userName 사용자 이름
	 * @param phoneNumber 전화번호
	 * @return 사용자 엔티티
	 */
	@Transactional(readOnly = true)
	public UserEntity selectByUserNameAndPhoneNumber(String userName, String phoneNumber) {
		try {
			return userRepository.findByUserNameAndPhoneNumber(userName, phoneNumber)
				.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User search by name and phone number failed: {}", e.getMessage());
			throw new UserException(ErrorCode.USER_SEARCH_ERROR);
		}
	}

	/**
	 * 전화번호로 사용자 찾기
	 * @param phoneNumber 전화번호
	 * @return 사용자 엔티티
	 */
	@Transactional(readOnly = true)
	public UserEntity selectByPhoneNumber(String phoneNumber) {
		try {
			return userRepository.findByPhoneNumber(phoneNumber)
				.orElseThrow(() -> new UserException(ErrorCode.USER_NOT_FOUND));
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User search by phone number failed: {}", e.getMessage());
			throw new UserException(ErrorCode.USER_SEARCH_ERROR);
		}
	}

	/**
	 * 사용자 정보 업데이트
	 * @param user 업데이트할 사용자 엔티티
	 * @return 업데이트한 사용자 엔티티
	 */
	@Transactional
	public UserEntity updateUser(UserEntity user) {
		try {
			return userRepository.save(user);
		} catch (Exception e) {
			log.error("User update failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional(readOnly = true)
	public boolean verifyPassword(Integer userId, String password) {
		try {
			UserEntity user = selectById(userId);
			return passwordEncoder.matches(password, user.getPassword());
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User verify password failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public void updatePassword(Integer userId, String newPassword) {
		try {
			UserEntity user = selectById(userId);
			String encodedPassword = passwordEncoder.encode(newPassword);
			user.updatePassword(encodedPassword);
			updateUser(user);
		} catch (UserException e) {
			throw e;
		} catch (Exception e) {
			log.error("User update password failed: {}", e.getMessage());
			throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}
}
