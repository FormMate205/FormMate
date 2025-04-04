import api from '@/shared/api/instance';

export const exchangeCodeForToken = async (code: string) => {
    const response = await api.post('/auth/exchange-code', {
        code,
    });

    return response.data;
};
