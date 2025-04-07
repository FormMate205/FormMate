package com.corp.formmate.user.service;

import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.error.code.ErrorCode;
import com.corp.formmate.global.error.exception.UserException;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.user.dto.RegisterRequest;
import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.Mockito;

import java.lang.reflect.Field;

import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@Slf4j
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    VerificationService verificationService;

    @Mock
    private FcmTokenService fcmTokenService;

    @Mock
    private MessageService messageService;

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private UserService userService;

    // UserServiceTest 클래스 내부에 추가
    private void setEntityId(UserEntity entity, Integer id) {
        try {
            Field idField = UserEntity.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set ID field", e);
        }
    }

    @Test
    @DisplayName("이메일로 사용자 조회 - 성공")
    void selectByEmail_Success() {
        // given
        String email = "test@example.com";
        UserEntity mockUser = UserEntity.builder()
                .email(email)
                .userName("테스트유저")
                .build();

        setEntityId(mockUser, 1);

        //"테스트 코드에서 userRepository.findByEmail(email)이 호출되면,
        // 실제 데이터베이스에 접근하지 않고 대신 Optional.of(mockUser)를 반환하라"
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        // when
        UserEntity foundUser = userService.selectByEmail(email);

        // then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getEmail()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("이메일로 사용자 조회 - 실패")
    void selectByEmail_NotFound() {
        // given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.selectByEmail(email))
                .isInstanceOf(UserException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);

        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("ID로 사용자 조회 - 성공")
    void selectById_Success() {
        // given
        int id = 1;
        UserEntity mockUser = UserEntity.builder()
                .email("test@example.com")
                .userName("테스트유저")
                .build();

        setEntityId(mockUser, id);

        when(userRepository.findById(id)).thenReturn(Optional.of(mockUser));

        // when
        UserEntity foundUser = userService.selectById(id);

        // then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getEmail()).isEqualTo(id);
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("ID로 사용자 조회 - 실패")
    void selectById_NotFound() {
        // given
        int id = 99;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.selectById(id))
                .isInstanceOf(UserException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);

        verify(userRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("이메일 중복 확인")
    void checkEmailAvailability() {
        // given
        String email = "test@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(false);

        // when
        boolean isAvailable = userService.checkEmailAvailability(email);

        // then
        assertThat(isAvailable).isTrue();
        verify(userRepository, times(1)).existsByEmail(email);

    }

    @Test
    @DisplayName("전화번호 중복 확인")
    void checkPhoneNumberAvailability() {
        // given
        String phoneNumber = "01012345678";
        when(userRepository.existsByPhoneNumber(phoneNumber)).thenReturn(false);

        // when
        boolean isAvailable = userService.checkPhoneNumberAvailability(phoneNumber);

        // then
        assertThat(isAvailable).isTrue();
        verify(userRepository, times(1)).existsByPhoneNumber(phoneNumber);
    }

    @Test
    @DisplayName("회원가입 - 성공")
    void register_Success() {
        // given
        String email = "test@example.com";
        String phoneNumber = "01012345678";
        String password = "Password123!";
        String encodedPassword = "encodedPassword";

        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setUserName("테스트유저");
        request.setPhoneNumber(phoneNumber);
        request.setAddress("서울시 강남구");
        request.setAddressDetail("123동 456호");
        request.setProvider(Provider.LOCAL);

        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(userRepository.existsByPhoneNumber(phoneNumber)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);

        UserEntity savedUser = UserEntity.builder().email(email)
                .password(encodedPassword)
                .userName("테스트유저")
                .phoneNumber(phoneNumber)
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .status(true)
                .build();

        setEntityId(savedUser, 1);

        when(userRepository.save(any(UserEntity.class))).thenReturn(savedUser);

        // when
        UserEntity result = userService.register(request, phoneNumber);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        assertThat(result.getPhoneNumber()).isEqualTo(phoneNumber);
        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(fcmTokenService, times(1)).register(any(UserEntity.class));
    }

    @Test
    @DisplayName("회원가입 - 이메일 중복")
    void register_EmailDuplicated() {
        // given
        String email = "test@example.com";
        String phoneNumber = "01012345678";

        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword("Password123!");
        request.setUserName("테스트유저");
        request.setPhoneNumber(phoneNumber);

        when(userRepository.existsByEmail(email)).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.register(request, phoneNumber))
                .isInstanceOf(UserException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.EMAIL_DUPLICATE);

        verify(userRepository, times(1)).existsByEmail(email);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("OAuth2 사용자 정보로 사용자 조회 또는 생성 - 기존 사용자")
    void getOrCreateOAuth2User_ExistingUser() {
        // given
        String email = "test@example.com";
        OAuth2UserInfo userInfo = OAuth2UserInfo.builder()
                .id("oauth-id")
                .email(email)
                .name("OAuth 사용자")
                .build();

        UserEntity existingUser = UserEntity.builder()
                .email(email)
                .userName("OAuth 사용자")
                .provider(Provider.GOOGLE)
                .role(Role.USER)
                .build();

        setEntityId(existingUser, 1);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));

        // when
        UserEntity result = userService.getOrCreateOAuth2User(userInfo, Provider.GOOGLE);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(email);
        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, never()).save(any(UserEntity.class));
    }
}
