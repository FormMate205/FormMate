package com.corp.formmate.global.config;

import com.corp.formmate.fcmtoken.service.FcmTokenService;
import com.corp.formmate.global.resolver.CurrentUserArgumentResolver;
import com.corp.formmate.global.security.CustomAuthenticationEntryPoint;
import com.corp.formmate.jwt.filter.JwtAuthenticationFilter;
import com.corp.formmate.jwt.properties.JwtProperties;
import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.jwt.service.JwtTokenService;
import com.corp.formmate.user.handler.OAuth2LoginSuccessHandler;
import com.corp.formmate.user.service.CustomOAuth2UserService;
import com.corp.formmate.user.service.CustomUserDetailsService;
import com.corp.formmate.user.service.MessageService;
import com.corp.formmate.user.service.VerificationService;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;

/**
 * Spring Security 및 JWT 관련 빈을 Mock으로 제공하는 테스트 설정 클래스
 */
@TestConfiguration
public class TestSecurityBeansConfig {

    @Bean
    public JwtTokenProvider jwtTokenProvider() {
        return Mockito.mock(JwtTokenProvider.class);
    }

    @Bean
    public CustomUserDetailsService customUserDetailsService() {
        return Mockito.mock(CustomUserDetailsService.class);
    }

    @Bean
    public AuthenticationConfiguration authenticationConfiguration() {
        return Mockito.mock(AuthenticationConfiguration.class);
    }

    @Bean
    public JwtProperties jwtProperties() {
        return Mockito.mock(JwtProperties.class);
    }

    @Bean
    public JwtTokenService jwtTokenService() {
        return Mockito.mock(JwtTokenService.class);
    }

    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return Mockito.mock(CustomOAuth2UserService.class);
    }

    @Bean
    public OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler() {
        return Mockito.mock(OAuth2LoginSuccessHandler.class);
    }

    @Bean
    public FcmTokenService fcmTokenService() {
        return Mockito.mock(FcmTokenService.class);
    }

    @Bean
    public MessageService messageService() {
        return Mockito.mock(MessageService.class);
    }

    @Bean
    public VerificationService verificationService() {
        return Mockito.mock(VerificationService.class);
    }

    @Bean
    public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
        return Mockito.mock(CustomAuthenticationEntryPoint.class);
    }

    @Bean
    public CurrentUserArgumentResolver currentUserArgumentResolver() {
        return Mockito.mock(CurrentUserArgumentResolver.class);
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return Mockito.mock(ClientRegistrationRepository.class);
    }

    @Bean
    public OAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository() {
        return Mockito.mock(OAuth2AuthorizedClientRepository.class);
    }

    @Bean
    public OAuth2AuthorizedClientService oAuth2AuthorizedClientService() {
        return Mockito.mock(OAuth2AuthorizedClientService.class);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider(), customUserDetailsService());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        AuthenticationConfiguration mockConfig = authenticationConfiguration();
        AuthenticationManager mockManager = Mockito.mock(AuthenticationManager.class);
        Mockito.when(mockConfig.getAuthenticationManager()).thenReturn(mockManager);
        return mockManager;
    }
}