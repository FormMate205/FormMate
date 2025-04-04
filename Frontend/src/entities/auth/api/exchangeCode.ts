import api from '@/shared/api/instance';

export const exchangeCodeForToken = async (code: string) => {
    const response = await api.post('/auth/exchange-code', {
        code,
    });

    const accessToken = response.headers['authorization'];
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    return response.data;
};
