package com.scheduler.scheduler.security;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthServiceClient authServiceClient;

    public AuthInterceptor(AuthServiceClient authServiceClient) {
        this.authServiceClient = authServiceClient;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        boolean requiresAuth =
                handlerMethod.hasMethodAnnotation(RequireAuth.class) ||
                handlerMethod.getBeanType().isAnnotationPresent(RequireAuth.class);

        if (!requiresAuth) {
            return true;
        }

        String cookieHeader = request.getHeader(HttpHeaders.COOKIE);
        boolean authenticated = authServiceClient.isSessionAuthenticated(cookieHeader);

        if (!authenticated) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("""
                {"success":false,"code":"UNAUTHORIZED","message":"Authentication required"}
            """);
            return false;
        }

        return true;
    }
}