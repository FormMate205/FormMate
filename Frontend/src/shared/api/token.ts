import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// accessToken 저장
export const setAccessToken = (token: string) => {
    const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    localStorage.setItem(ACCESS_TOKEN_KEY, formattedToken);
};

// refreshToken 저장
export const setRefreshToken = (token: string) => {
    const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    localStorage.setItem(REFRESH_TOKEN_KEY, formattedToken);
};

// accessToken 가져오기
export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// refreshToken 가져오기
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// accessToken 삭제
export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// refreshToken 삭제
export const removeRefreshToken = () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 둘 다 제거
export const clearToken = () => {
    removeAccessToken();
    removeRefreshToken();
};

// 토큰 갱신 요청 (refresh API 호출)
export const refreshToken = async (): Promise<{ accessToken: string }> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        {
            headers: {
                Authorization: refreshToken,
            },
            withCredentials: true,
        },
    );

    return response.data; // { accessToken: string, message: string }
};

// accessToken 유효성 검사
export const isTokenValid = (): boolean => {
    const token = getAccessToken();
    if (!token) return false;

    try {
        const tokenParts = token.split(' ');
        const jwtToken = tokenParts.length > 1 ? tokenParts[1] : tokenParts[0];
        const payload = JSON.parse(atob(jwtToken.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};
