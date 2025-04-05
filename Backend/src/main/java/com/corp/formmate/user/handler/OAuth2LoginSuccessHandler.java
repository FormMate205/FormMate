package com.corp.formmate.user.handler;

import com.corp.formmate.user.dto.LoginResponse;
import com.corp.formmate.user.entity.Provider;
import com.corp.formmate.user.entity.UserEntity;
import com.corp.formmate.user.service.OAuth2AuthorizationService;
import com.corp.formmate.user.service.OAuth2UserInfo;
import com.corp.formmate.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2AuthorizationService oauth2AuthorizationService;
    private final UserService userService;

    // 프론트엔드 URL을 환경변수나 설정에서 가져오도록 조정
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException{
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User  = oauthToken.getPrincipal();

        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        String userNameAttributeName = oauthToken.getAuthorizedClientRegistrationId();

        log.info("OAuth2 로그인 성공: registrationId={}, username={}", registrationId, oAuth2User.getName());

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
                log.info("기존 사용자 조회 성공: email={}, id={}", userInfo.getEmail(), user.getId());
            } catch (UsernameNotFoundException e) {
                // 사용자가 없으면 생성
                log.info("신규 사용자 생성: email={}", userInfo.getEmail());
                user = userService.getOrCreateOAuth2User(userInfo, Provider.valueOf(registrationId.toUpperCase()));
            }

            // 추가정보(주소, 전화번호)가 필요한지 확인
            boolean needsAdditionalInfo = user.getAddress() == null ||
                    user.getPhoneNumber() == null ||
                    user.getAddress().isEmpty() ||
                    user.getPhoneNumber().isEmpty();

            log.info("추가 정보 필요 여부: {}", needsAdditionalInfo);

            // 일회용 인증 코드 생성
            String authCode = oauth2AuthorizationService.generateAuthorizationCode(user.getId());

            // LoginResponse DTO 생성 및 응답 설정
            LoginResponse loginResponse = new LoginResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getUserName(),
                    needsAdditionalInfo  // 추가 정보 필요 여부 필드 추가
            );

            // JSON 응답 설정
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new ObjectMapper().writeValueAsString(loginResponse));

            log.info("OAuth2 로그인 처리 완료: userId={}, needsAdditionalInfo={}", user.getId(), needsAdditionalInfo);


        } catch (Exception e) {
            log.error("OAuth2 로그인 실패", e);
            getRedirectStrategy().sendRedirect(request, response, "/login?error=oauth_failed");
        }

    }

}
