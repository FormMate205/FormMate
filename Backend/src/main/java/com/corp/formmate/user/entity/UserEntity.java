package com.corp.formmate.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider = Provider.LOCAL;

    private String password;

    @Column(name = "user_name", length = 100)
    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(length = 20)
    private String phonenumber;

    @Column(length = 225)
    private String address;

    @Column(name = "address_detail", length = 255)
    private String addressDetail;

    @Column(nullable = false)
    private boolean status = true;

    @Column(name = "bank_code")
    private Integer bankCode;

    @Column(name = "account_number", length = 32)
    private String accountNumber;

    @Column(name = "account_password", length = 12)
    private String accountPassword;

    @Builder
    public UserEntity(String email, Provider provider, String password, String userName,
                Role role, String phonenumber, String address, String addressDetail,
                boolean status, Integer bankCode, String accountNumber, String accountPassword) {
        this.email = email;
        this.provider = provider != null ? provider : Provider.LOCAL;
        this.password = password;
        this.userName = userName;
        this.role = role != null ? role : Role.USER;
        this.phonenumber = phonenumber;
        this.address = address;
        this.addressDetail = addressDetail;
        this.status = status;
        this.bankCode = bankCode;
        this.accountNumber = accountNumber;
        this.accountPassword = accountPassword;
    }


}
