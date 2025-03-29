import axios from '@/shared/api/instance';
import { LoginFormSchema } from '../model/types';

export const login = async ({ email, password }: LoginFormSchema) => {
    const response = await axios.post('/auth/email/login', {
        email,
        password,
    });

    const data = response.data;
    const token =
        response.headers['authorization'] || response.headers['Authorization'];

    if (!token) {
        throw new Error('Access Token이 응답에 포함되어 있지 않습니다.');
    }

    localStorage.setItem('accessToken', token);

    return {
        success: true,
        token,
        user: {
            email: data.email,
            name: data.userName,
        },
    };
};
