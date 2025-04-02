import { setAccessToken } from '@/entities/auth/model/authService';
import { User } from '@/entities/user/model/types';
import api from '@/shared/api/instance';
import { LoginFormSchema } from '../../../features/auth/login/model/types';

export const login = async ({ email, password }: LoginFormSchema) => {
    const response = await api.post('/auth/email/login', {
        email,
        password,
    });

    const data = response.data;
    const token =
        response.headers['authorization'] || response.headers['Authorization'];

    if (!token) {
        throw new Error('Access Token이 응답에 포함되어 있지 않습니다.');
    }

    setAccessToken(token);

    const user: Partial<User> = {
        userId: String(data.userId),
        userName: data.userName,
        email: data.email,
        isLogged: true,
        hasAccount: false, // 기본값, 나중에 계좌 정보 조회로 업데이트 필요
    };

    return {
        success: true,
        token,
        user,
    };
};
