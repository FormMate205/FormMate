package com.corp.formmate.user.handler;

import com.corp.formmate.jwt.dto.Token;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.OAuth2UserInfo;
import com.corp.formmate.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final JwtProperties jwtProperties;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException{

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User  = oauthToken.getPrincipal();

        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        String userNameAttributeName = oauthToken.getAuthorizedClientRegistrationId();

        // OAuth2 사용자 정보 추출
        OAuth2UserInfo userInfo = OAuth2UserInfo.of(
                registrationId,
                userNameAttributeName,
                oAuth2User.getAttributes()
        );

        try {
            // 이메일로 사용자 조회
            UserEntity user;
            try {
                user = userService.selectByEmail(userInfo.getEmail());
            } catch (UsernameNotFoundException e) {
                // 사용자가 없으면 생성
                log.info("Creating new OAuth2 user with email: " + userInfo.getEmail());
                user = userService.getOrCreateOAuth2User(userInfo, Provider.valueOf(registrationId.toUpperCase()));
            }

            // 추가정보(주소, 전화번호)가 필요한지 확인
            boolean needsAdditionalInfo = user.getAddress() == null ||
                    user.getPhoneNumber() == null ||
                    user.getAddress().isEmpty() ||
                    user.getPhoneNumber().isEmpty();

            // JWT 토큰 생성
            Token token = jwtTokenService.createTokens(user.getId());

            // refresh token 쿠키에 저장
            jwtTokenService.setRefreshTokenCookie(response, token.getRefreshToken(), jwtProperties.isSecureFlag());

            // 리다이렉트 URL 결정 (c추가 정보 필요 여부에 따라)
            String targetUrl = determineTargetUrl(token.getAccessToken(), needsAdditionalInfo);

            // 리다이렉트
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            log.error("OAuth2 login failed", e);
            getRedirectStrategy().sendRedirect(request, response, "/login?error=oauth_failed");
        }

    }

    /**
     * 로그인 후 리다이렉트 할 URL 결정
     */
    private String determineTargetUrl(String accessToken, boolean needsAdditionalInfo) {
        if (needsAdditionalInfo) {
            // 추가 정보가 필요한 경우 프로필 완성 페이지로 이동
            return UriComponentsBuilder.fromUriString("/complete-profile")
                    .queryParam("token", accessToken)
                    .build().toUriString();
        } else {
            // 추가 정보가 필요 없는 경우 메인 페이지로 이동
            return UriComponentsBuilder.fromUriString("/")
                    .queryParam("token", accessToken)
                    .build().toUriString();
        }
    }
}
