package com.corp.formmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

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
                .setAllowedOriginPatterns(allowedOrigins.split(","))
                .withSockJS();

        log.info("Websocket endpoint registered: {}: " + endpoint);
        log.info("Websocket allowed origins: {}", allowedOrigins);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 필요하다면 인터셉터 추가 (인증 인터셉터)

    }
}
