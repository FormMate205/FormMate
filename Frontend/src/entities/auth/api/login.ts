import { setAccessToken } from '@/entities/auth/model/authService';
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

    return {
        success: true,
        token,
        user: {
            email: data.email,
            name: data.userName,
        },
    };
};
