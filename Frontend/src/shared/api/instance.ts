import axios from 'axios';
import { getAccessToken, removeAccessToken, saveAccessToken } from './token';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URI,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 시 Authorization 헤더 설정
api.interceptors.request.use((config) => {
    const token = getAccessToken();

    // 로그인 요청은 제외
    const isAuthRequest =
        config.url?.includes('/auth/email/login') ||
        config.url?.includes('/auth/refresh');

    if (token && !isAuthRequest) {
        config.headers.Authorization = token.startsWith('Bearer')
            ? token
            : `Bearer ${token}`;
    }
    return config;
});

// 401 응답 시 refresh 요청
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshRes = await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newAccessToken = refreshRes.data.accessToken;
                saveAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                removeAccessToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
