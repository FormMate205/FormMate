import axios from 'axios';
import { useUserStore } from '@/entities/user/model/userStore';
import {
    getAccessToken,
    setAccessToken,
    refreshToken,
    clearToken,
} from './token';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URI,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 시 accessToken 붙이기
api.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
        config.headers.Authorization = accessToken;
    }
    return config;
});

// 401 응답 시 refresh 요청
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (response?.status === 401 && !config._retry) {
            config._retry = true;
            try {
                const { accessToken } = await refreshToken();
                setAccessToken(accessToken);

                config.headers.Authorization = accessToken;
                return api(config); // 원래 요청 재시도
            } catch (refreshError) {
                clearToken();

                const store = useUserStore.getState();
                store.clearUser();
                store.setLoggedIn(false);

                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
