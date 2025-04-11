import api from '@/shared/api/instance';

export const refreshToken = async (): Promise<string> => {
    const response = await api.post(
        '/auth/refresh',
        {},
        { responseType: 'text' },
    );
    const tokenFromHeader = response.headers['authorization']?.replace(
        'Bearer ',
        '',
    );

    return tokenFromHeader;
};
