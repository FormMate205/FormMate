package com.corp.formmate.user.service;

import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userService.selectByEmail(email);

        return new User(
                user.getEmail(), // userName으로 이메일 사용
                user.getPassword(), // 비밀번호
                user.isStatus(), // 계정 활성화 여부
                true, // 계정 만료 여부
                true, // 자격 증명 만료 여부
                true, // 계정 잠금 여부
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    public UserDetails loadUserById(int userId) {
        UserEntity user = userService.selectById(userId);

        return new User(
                user.getEmail(), // userName으로 이메일 사용
                user.getPassword() != null ? user.getPassword() : "", // OAuth 사용자는 비밀번호가 없을 수 있음
                user.isStatus(), // 계정 활성화 여부
                true, // 계정 만료 여부
                true, // 자격 증명 만료 여부
                true, // 계정 잠금 여부
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
