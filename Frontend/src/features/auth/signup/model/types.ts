// API 요청 시 사용할 타입
export interface RegisterUserRequest {
    email: string;
    password: string;
    userName: string;
    phoneNumber: string;
    address: string;
    addressDetail: string;
    provider: 'LOCAL';
}

// 폼 상태를 관리하기 위한 타입
export interface SignupFormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    detailAddress: string;
    certCode: string;
    isEmailChecked: boolean;
    isPhoneVerified: boolean;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    message: string;
    errors: {
        field: string;
        value: string;
        reason: string;
    }[];
}

// 휴대폰 인증 코드 검증 요청 타입
export interface VerifyCodeRequest {
    phoneNumber: string;
    code: string;
}
