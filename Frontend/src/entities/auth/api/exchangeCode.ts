import api from '@/shared/api/instance';

export const exchangeCodeForToken = async (authCode: string) => {
    const response = await api.post(
        '/auth/exchange-code',
        { code: authCode },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return response;
};
