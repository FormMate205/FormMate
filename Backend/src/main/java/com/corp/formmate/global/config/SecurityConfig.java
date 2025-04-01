package com.corp.formmate.global.config;

import java.util.Arrays;

import com.corp.formmate.global.security.CustomAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.corp.formmate.jwt.filter.JwtAuthenticationFilter;
import com.corp.formmate.user.handler.OAuth2LoginSuccessHandler;
import com.corp.formmate.user.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomUserDetailsService customUserDetailsService;
	private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
	private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

	@Autowired
	public SecurityConfig(
			@Lazy CustomUserDetailsService customUserDetailsService,
			@Lazy JwtAuthenticationFilter jwtAuthenticationFilter,
			@Lazy OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
			CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
		this.customUserDetailsService = customUserDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
		this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
	}

	// 프로덕션 환경용 설정
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
					// 모든 API 경로에 접근 허용 (개발 편의를 위해)
					.requestMatchers("/api/**", "/oauth2/**", "/login/oauth2/code/**", "/auth/**").permitAll()
					.anyRequest()
					.authenticated()
				//				// 공개 API 경로 설정
				//				.requestMatchers("/api/auth/**", "/api/public/**", "/api/swagger-ui/**", "api/api-docs/**")
				//				.permitAll()
				//				// 나머지 경로는 인증 필요
				//				.anyRequest()
				//				.authenticated()
			)
			// OAuth2 로그인 설정 추가
			.oauth2Login(oauth2 -> oauth2
				// .loginPage("/login") - 커스텀 로그인 페이지가 없으면 주석 처리
				.redirectionEndpoint(endpoint -> endpoint
					.baseUri("/api/login/oauth2/code/*") // 중요: 리디렉션 엔드포인트 설정
				)
				.defaultSuccessUrl("/")
				.successHandler(oAuth2LoginSuccessHandler)
			)
//			// 인증 실패 시 401 응답 반환하도록 설정 (리다이렉트 방지)
//			.exceptionHandling(exceptions -> exceptions
//				.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
//			);
			// 인증 실패 시 커스텀 응답 반환
			.exceptionHandling(exceptions -> exceptions
					.authenticationEntryPoint(customAuthenticationEntryPoint)
			);

		// Jwt 필터 추가
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public DaoAuthenticationProvider daoAuthenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(customUserDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		// 프로덕션 환경에서는 명시적으로 허용된 도메인만 지정
//		configuration.setAllowedOriginPatterns(List.of("*"));
		configuration.setAllowedOriginPatterns(Arrays.asList(
				"https://j12a205.p.ssafy.io",
				"http://localhost:5173"
		));

		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

		// 클라이언트에 노출할 응답 헤더 지정
		configuration.setExposedHeaders(Arrays.asList("Authorization"));

		configuration.setAllowCredentials(true);
		// 1시간동안 preflight 결과 캐싱
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}