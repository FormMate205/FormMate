package com.corp.formmate.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TokenRefreshResponse {
    private String accessToken;
    private String message;
}
