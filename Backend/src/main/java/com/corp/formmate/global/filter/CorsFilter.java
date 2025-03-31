package com.corp.formmate.global.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // 최우선 순위로 필터 적용
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        // 요청의 Origin 헤더 가져오기
        String origin = request.getHeader("Origin");

        // 허용할 오리진 확인 및 헤더 설정
        if (origin != null && (origin.equals("http://localhost:5173") ||
                origin.equals("https://j12a205.p.ssafy.io"))) {
            // 요청 오리진에 따라 동적으로 설정
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Expose-Headers", "Authorization");

            // Preflight 요청(OPTIONS)에 대한 처리
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
                response.setHeader("Access-Control-Max-Age", "3600"); // 1시간 동안 preflight 결과 캐싱
                response.setStatus(HttpServletResponse.SC_OK);
                return; // OPTIONS 요청에 대해서는 여기서 응답 종료
            }
        }

        // 필터 체인 계속 진행
        chain.doFilter(req, res);
    }

}
