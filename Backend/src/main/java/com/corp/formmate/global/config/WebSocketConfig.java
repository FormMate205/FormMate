package com.corp.formmate.global.config;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.corp.formmate.jwt.provider.JwtTokenProvider;
import com.corp.formmate.user.service.CustomUserDetailsService;
import com.corp.formmate.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetailsService customUserDetailsService;
	private final UserService userService;

	@Value("${websocket.endpoint}")
	private String endpoint;

	@Value("${websocket.allowed-origins}")
	private String allowedOrigins;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 클라이언트가 구독할 수 있는 주제 정의
		// "/topic"은 일대다 메시징 주제 접두사
		// "/queue"는 일대일 메시징 주제 접두사
		registry.enableSimpleBroker("/topic", "/queue");

		// 클라이언트에서 서버로 메세지를 보낼 때 사용할 접두사 정의
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// 웹소켓 연결 엔드포인트 등록. SockJS를 사용하여 WebSocket을 지원하지 않는 브라우저에 대한 폴백도 제공
		registry.addEndpoint(endpoint)
			.setAllowedOriginPatterns(allowedOrigins.split(","));
		registry.addEndpoint(endpoint + "/")
			.setAllowedOriginPatterns(allowedOrigins.split(","));

		log.info("Websocket endpoint registered: {}: " + endpoint);
		log.info("Websocket allowed origins: {}", allowedOrigins);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					// 기본값으로 익명 인증 설정
					UsernamePasswordAuthenticationToken user =
						new UsernamePasswordAuthenticationToken("anonymous", null, Collections.emptyList());

					// 헤더에서 토큰 추출
					List<String> authorization = accessor.getNativeHeader("Authorization");
					if (authorization != null && !authorization.isEmpty()) {
						String bearerToken = authorization.get(0).replace("Bearer ", "");

						try {
							// JWT 토큰 검증 (jwtService 빈을 주입받아야 함)
							String userIdStr = jwtTokenProvider.getUserIdFromToken(bearerToken);
							Integer userId = Integer.parseInt(userIdStr);
							String username = userService.selectById(userId).getEmail();

							if (username != null) {
								// 실제 사용자 정보로 인증 객체 업데이트
								UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
								user = new UsernamePasswordAuthenticationToken(
									userDetails, null, userDetails.getAuthorities());
							}
						} catch (Exception e) {
							log.error("Invalid JWT token in WebSocket connection", e);
							// 오류 시에도 기본 익명 인증은 유지됨
						}
					}

					// 사용자 정보 설정
					accessor.setUser(user);
				}
				return message;
			}
		});
	}
}
