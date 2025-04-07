package com.corp.formmate.user.service;

import com.corp.formmate.user.dto.AuthUser;
import com.corp.formmate.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userService.selectByEmail(email);

        return AuthUser.create(user);
    }

    public UserDetails loadUserById(int userId) {
        UserEntity user = userService.selectById(userId);

        return AuthUser.create(user);
    }
}
