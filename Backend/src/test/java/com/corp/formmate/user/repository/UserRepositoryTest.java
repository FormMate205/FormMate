package com.corp.formmate.user.repository;

import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("이메일로 사용자 조회 - 성공")
    void findByEmail_Success() {
        // given
        String email = "test@example.com";
        UserEntity user = UserEntity.builder()
                .email(email)
                .password("password123!")
                .userName("테스트유저")
                .phoneNumber("01023456789")
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // when
        Optional<UserEntity> foundUser = userRepository.findByEmail(email);

        // then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(email);
        assertThat(foundUser.get().getUserName()).isEqualTo("테스트유저");
    }

    @Test
    @DisplayName("이메일로 사용자 조회 - 실패")
    void findByEmail_Fail() {
        // given
        String email = "nonexistent@example.com";

        // when
        Optional<UserEntity> foundUser = userRepository.findByEmail(email);

        // then
        assertThat(foundUser).isEmpty();
    }

    @Test
    @DisplayName("이메일 존재 여부 확인")
    void existsByEmail() {
        // given
        String email = "test@example.com";
        UserEntity user = UserEntity.builder()
                .email(email)
                .password("password123!")
                .userName("테스트유저")
                .phoneNumber("01023456789")
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // when
        boolean exists = userRepository.existsByEmail(email);
        boolean notExists = userRepository.existsByEmail("nonexistent@example.com");

        // then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("전화번호 존재 여부 확인")
    void existsByPhoneNumber() {
        // given
        String phoneNumber = "01023456789";
        UserEntity user = UserEntity.builder()
                .email("test@example.com")
                .password("password123!")
                .userName("테스트유저")
                .phoneNumber(phoneNumber)
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // when
        boolean exists = userRepository.existsByPhoneNumber(phoneNumber);
        boolean notExists = userRepository.existsByPhoneNumber("01099999999");

        // then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("이름과 전화번호로 사용자 조회")
    void findByUserNameAndPhoneNumber() {
        // given
        String userName = "테스트유저";
        String phoneNumber = "01023456789";
        UserEntity user = UserEntity.builder()
                .email("test@example.com")
                .password("password123!")
                .userName(userName)
                .phoneNumber(phoneNumber)
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .build();

        // when
        Optional<UserEntity> foundUser = userRepository.findByUserNameAndPhoneNumber(userName, phoneNumber);

        // then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserName()).isEqualTo(userName);
        assertThat(foundUser.get().getPhoneNumber()).isEqualTo(phoneNumber);
    }

    @Test
    @DisplayName("전화번호로 사용자 조회")
    void findByPhoneNumber() {
        // given
        String phoneNumber = "01023456789";
        UserEntity user = UserEntity.builder()
                .email("test@example.com")
                .password("password123!")
                .userName("테스트유저")
                .phoneNumber(phoneNumber)
                .address("서울시 강남구")
                .addressDetail("123동 456호")
                .provider(Provider.LOCAL)
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // when
        Optional<UserEntity> foundUser = userRepository.findByPhoneNumber(phoneNumber);

        // then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getPhoneNumber()).isEqualTo(phoneNumber);
    }
}
