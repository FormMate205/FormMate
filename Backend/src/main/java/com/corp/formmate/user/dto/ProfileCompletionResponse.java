package com.corp.formmate.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileCompletionResponse {
    private Integer id;
    private String email;
    private String userName;
    private String message;
}
