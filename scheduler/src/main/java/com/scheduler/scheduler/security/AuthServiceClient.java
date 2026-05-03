package com.scheduler.scheduler.security;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.scheduler.scheduler.config.AuthProperties;

import reactor.core.publisher.Mono;

@Component
public class AuthServiceClient {

    private final WebClient webClient;
    private final AuthProperties authProperties;

    public AuthServiceClient(AuthProperties authProperties) {
        this.authProperties = authProperties;
        this.webClient = WebClient.builder()
                .baseUrl(authProperties.getServiceBaseUrl())
                .build();
    }

    public boolean isSessionAuthenticated(String cookieHeader) {
        if (cookieHeader == null || cookieHeader.isBlank()) {
            return false;
        }

        try {
            Map<String, Object> resp = webClient.get()
                    .uri(authProperties.getMeEndpoint())
                    .header(HttpHeaders.COOKIE, cookieHeader)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse -> Mono.error(new RuntimeException("Unauthorized")))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofMillis(authProperties.getTimeoutMs()))
                    .block();

            if (resp == null) return false;

            Object authenticated = resp.get("authenticated");
            return Boolean.TRUE.equals(authenticated);
        } catch (Exception ex) {
            return false;
        }
    }
}