package com.corp.formmate.user.service;

import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.Role;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 서비스 구분 (google, naver, kakao)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Provider provider = getProvider(registrationId);

        // OAuth2 로그인 진행 시 키가 되는 필드값 (PK) (구글: "sub", 네이버: "id", 카카오: "id'")
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // OAuth2 로그인을 통해 가져온 OAuthUSer의 attribute
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // OAuth2 서비스별로 다른 회원정보를 통합하는 작업이 필요
        OAuth2UserInfo userInfo = OAuth2UserInfo.of(registrationId, userNameAttributeName, attributes);

        // 사용자 정보 조회 또는 생성
        UserEntity user = getOrCreateUser(userInfo, provider);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attributes, userNameAttributeName
        );
    }

    /**
     * 사용자 정보가 존재하면 업데이트, 없으면 생성
     */
    private UserEntity getOrCreateUser(OAuth2UserInfo userInfo, Provider provider) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(userInfo.getEmail());

        if (existingUser.isPresent()) {
            // 이미 가입된 경우, 정보 업데이트 (필요에 따라)
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

            return userRepository.save(newUser);
        }
    }

    /**
     * provider 문자열을 Provider 열서형으로 변황
     */
    private Provider getProvider(String registrationId) {
        if (registrationId.equals("google")) {
            return Provider.GOOGLE;
        } else if (registrationId.equals("naver")) {
            return Provider.NAVER;
        } else if (registrationId.equals("kakao")) {
            return Provider.KAKAO;
        }
        return Provider.LOCAL; // 기본값
    }
}
