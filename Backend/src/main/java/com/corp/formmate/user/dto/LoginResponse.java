package com.corp.formmate.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer userId;
    private String email;
    private String userName;
}
