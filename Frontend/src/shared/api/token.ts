import api from './instance';
const ACCESS_TOKEN_KEY = 'accessToken';

// accessToken을 localStorage에 저장
export const saveAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// localStorage에서 accessToken을 불러옴
export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// accessToken을 localStorage에서 제거
export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// AccessToken 갱신 요청
export const refreshToken = async (): Promise<string> => {
    const response = await api.post('/auth/refresh');
    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) {
        throw new Error('Access Token 갱신 실패');
    }

    localStorage.setItem('accessToken', `Bearer ${newAccessToken}`);
    return newAccessToken;
};
