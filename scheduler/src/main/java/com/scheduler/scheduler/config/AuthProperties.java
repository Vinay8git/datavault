package com.scheduler.scheduler.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {

    /**
     * Example: http://localhost:4000
     */
    private String serviceBaseUrl = "http://localhost:4000";

    /**
     * Endpoint used to validate session cookie.
     */
    private String meEndpoint = "/auth/me";

    /**
     * Timeout for auth validation in milliseconds.
     */
    private int timeoutMs = 2500;

    public String getServiceBaseUrl() {
        return serviceBaseUrl;
    }

    public void setServiceBaseUrl(String serviceBaseUrl) {
        this.serviceBaseUrl = serviceBaseUrl;
    }

    public String getMeEndpoint() {
        return meEndpoint;
    }

    public void setMeEndpoint(String meEndpoint) {
        this.meEndpoint = meEndpoint;
    }

    public int getTimeoutMs() {
        return timeoutMs;
    }

    public void setTimeoutMs(int timeoutMs) {
        this.timeoutMs = timeoutMs;
    }
}