import api from '@/shared/api/instance';

export const refreshToken = async (): Promise<string> => {
    try {
        const response = await api.post(
            '/auth/refresh',
            {},
            { responseType: 'text' },
        );
        const tokenFromHeader = response.headers['authorization']?.replace(
            'Bearer ',
            '',
        );

        if (!tokenFromHeader) {
            throw new Error('리프레시 토큰이 유효하지 않거나 만료되었습니다.');
        }
        return tokenFromHeader;
    } catch (error) {
        console.error('리프레시 토큰 갱신 실패:', error);
        throw error;
    }
};
