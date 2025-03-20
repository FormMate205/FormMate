package com.corp.formmate.jwt.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private String issuer;
    private String subjectPrefix;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;
    private long temporaryTokenExpiration;
}
