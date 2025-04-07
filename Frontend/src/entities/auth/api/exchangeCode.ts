import api from '@/shared/api/instance';

export const exchangeCodeForToken = async (authCode: string) => {
    try {
        const response = await api.post(
            '/auth/exchange-code',
            { code: authCode },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('토큰 교환 응답:', response);
        return response;
    } catch (error) {
        console.error('토큰 교환 중 오류 발생:', error);
        throw error;
    }
};
