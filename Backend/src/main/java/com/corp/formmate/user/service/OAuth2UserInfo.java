package com.corp.formmate.user.service;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

/**
 * 다양한 OAuth2 제공자로부터 받은 사용자 정보를 표준화하는 클래스
 */
@Getter
public class OAuth2UserInfo {

    private String id;
    private String email;
    private String name;

    @Builder
    public OAuth2UserInfo(String id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    /**
     * OAuth2 제공자 유형과 속성에 따라 적절한 OAuth2UserInfo 객체를 생성
     */
    public static OAuth2UserInfo of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        if (registrationId.equals("google")) {
            return ofGoogle(userNameAttributeName, attributes);
        } else if (registrationId.equals("naver")) {
            return ofNaver(userNameAttributeName, attributes);
        } else if (registrationId.equals("kakao")) {
            return ofKakao(userNameAttributeName, attributes);
        }
        throw new IllegalArgumentException("Unsupported OAuth2 provider " + registrationId);
    }

    /**
     * Google OAuth2 속성 매핑
     */
    private static OAuth2UserInfo ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .id((String) attributes.get(userNameAttributeName))
                .email((String) attributes.get("email"))
                .name((String) attributes.get("name"))
                .build();
    }

    /**
     * Naver OAuth2 속성 매핑
     */
    private static OAuth2UserInfo ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        // 네이버는 response 안에 사용자 정보가 있음
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return OAuth2UserInfo.builder()
                .id((String) response.get("id"))
                .email((String) response.get("email"))
                .name((String) response.get("name"))
                .build();
    }

    /**
     * Kakao OAuth2 속성 매핑
     */
    private static OAuth2UserInfo ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        // 카카오는 kakao_acount 안에 사용자 정보가 있고, 프로필 정보는 그 안의 profile에 있음
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        return OAuth2UserInfo.builder()
                .id(String.valueOf(attributes.get(userNameAttributeName)))
                .email((String) kakaoAccount.get("email"))
                .name((String) profile.get("nickname"))
                .build();
    }
}
