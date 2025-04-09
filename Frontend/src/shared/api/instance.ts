import axios from 'axios';
import { queryClient } from '@/app/provider/queryClient';
import { refreshToken } from '@/entities/auth/api/refreshToken';
import { useUserStore } from '@/entities/user/model/userStore';
import { setAccessToken } from '../../entities/auth/model/authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URI,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 공개 API 경로 목록 (인증이 필요하지 않은 API)
const publicApiPaths = [
    '/auth/email/login',
    '/auth/refresh',
    '/auth/register',
    '/auth/exchange-code',
];

// 요청 시 accessToken 붙이기
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
        config.headers.Authorization = accessToken;
    }
    return config;
});

// 리프레시 토큰 요청 중인지 추적
let isRefreshing = false;
// 리프레시 대기중인 요청들
let refreshSubscribers: Array<(token: string) => void> = [];

// 401 응답 시 refresh 요청
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 현재 요청 경로 확인
        const requestPath = originalRequest.url;
        const isPublicApi = publicApiPaths.some(
            (path) => requestPath && requestPath.includes(path),
        );

        // 공개 API에서 401 에러가 발생한 경우 - 토큰 갱신 시도 없이 에러 반환
        if (error.response?.status === 401 && isPublicApi) {
            return Promise.reject(error);
        }

        // refreshToken 요청 자체에서 에러가 난 경우
        if (error.response?.status === 401 && requestPath === '/auth/refresh') {
            // 인증 만료로 간주하고 login 페이지로 리디렉션
            localStorage.removeItem('accessToken');
            useUserStore.getState().clearUser();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // 일반 API 요청에서 401 에러 발생 (토큰 만료)
        if (
            error.response?.status === 401 &&
            !originalRequest._ &&
            !isPublicApi
        ) {
            originalRequest._retry = true;

            // 이미 토큰이 localStorage에 없는 경우, 리프레시 시도 없이 에러 반환
            if (!localStorage.getItem('accessToken')) {
                return Promise.reject(error);
            }

            // 진행 중인 리프레시 요청이 없으면 새로 시작
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newAccessToken = await refreshToken();
                    setAccessToken(newAccessToken);
                    queryClient.invalidateQueries({ queryKey: ['user'] });

                    // 대기 중인 요청들에 새 토큰 제공
                    refreshSubscribers.forEach((callback) =>
                        callback(newAccessToken),
                    );
                    refreshSubscribers = [];

                    // 현재 요청 재시도
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // 리프레시 실패 시 login 페이지로 리디렉션
                    localStorage.removeItem('accessToken');
                    useUserStore.getState().clearUser();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // 이미 리프레시 중이면 새 토큰을 받을 때까지 대기
                return new Promise((resolve) => {
                    refreshSubscribers.push((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    },
);

export default api;
