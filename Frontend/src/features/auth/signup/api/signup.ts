import api from '@/shared/api/instance';
import { RegisterUserRequest, VerifyCodeRequest } from '../model/types';

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<boolean> => {
    try {
        const response = await api.get('/auth/check/email', {
            params: { email },
        });
        return response.data; // true면 사용 가능, false면 중복
    } catch (error) {
        console.error('이메일 중복 확인 실패:', error);
        throw error;
    }
};

// 휴대폰 인증 요청
export const requestVerificationCode = async (
    phoneNumber: string,
): Promise<string> => {
    try {
        const response = await api.post('/auth/verification/request', {
            phoneNumber,
        });
        return response.data; // "인증코드가 발송되었습니다."
    } catch (error) {
        console.error('인증 코드 요청 실패:', error);
        throw error;
    }
};

// 인증 코드 검증
export const verifyCode = async (
    request: VerifyCodeRequest,
): Promise<string> => {
    try {
        const response = await api.post('/auth/verification/verify', request);
        return response.data; // "인증이 완료되었습니다."
    } catch (error) {
        console.error('인증 코드 검증 실패:', error);
        throw error;
    }
};

// 회원가입 요청
export const registerUser = async (
    userData: RegisterUserRequest,
): Promise<string> => {
    try {
        const response = await api.post('/auth/email/register', userData);
        return response.data; // success message
    } catch (error) {
        console.error('회원가입 실패:', error);
        throw error;
    }
};
