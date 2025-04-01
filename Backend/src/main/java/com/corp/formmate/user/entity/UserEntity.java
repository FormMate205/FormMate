package com.corp.formmate.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

	@Column(name = "phone_number", length = 20)
	private String phoneNumber;

	@Column(length = 225)
	private String address;

	@Column(name = "address_detail", length = 255)
	private String addressDetail;

	@Column(nullable = false)
	private boolean status = true;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "account_number", length = 32)
	private String accountNumber;

	@Column(name = "account_password", length = 12)
	private String accountPassword;

	@Column(name = "is_logged", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
	private boolean isLogged = true;

	@Builder
	public UserEntity(String email, Provider provider, String password, String userName,
		Role role, String phoneNumber, String address, String addressDetail,
		boolean status, String bankName, String accountNumber, String accountPassword) {
		this.email = email;
		this.provider = provider != null ? provider : Provider.LOCAL;
		this.password = password;
		this.userName = userName;
		this.role = role != null ? role : Role.USER;
		this.phoneNumber = phoneNumber;
		this.address = address;
		this.addressDetail = addressDetail;
		this.status = status;
		this.bankName = bankName;
		this.accountNumber = accountNumber;
		this.accountPassword = accountPassword;
	}

	// user 추가정보 수정
	public void updateAdditionalProfile(String phoneNumber, String address, String addressDetail) {
		this.phoneNumber = phoneNumber;
		this.address = address;
		this.addressDetail = addressDetail;
	}

	// 비밀번호 수정
	public void updatePassword(String password) {
		this.password = password;
	}

	// 주소 수정
	public void updateAddress(String address, String addressDetail) {
		this.address = address;
		this.addressDetail = addressDetail;
	}

	// 계좌정보 수정
	public void updateAccount(String bankName, String accountNumber, String accountPassword) {
		this.bankName = bankName;
		this.accountNumber = accountNumber;
		this.accountPassword = accountPassword;
	}

	// 계좌정보 삭제
	public void deleteAccount() {
		this.bankName = null;
		this.accountNumber = null;
		this.accountPassword = null;
	}

	// 상태 수정
	public void updateStatus(boolean status) {
		this.status = status;
	}

	// 로그인
	public void login() {
		this.isLogged = true;
	}

	// 로그아웃
	public void logout() {
		this.isLogged = false;
	}
}
