import api from '@/shared/api/instance';

// 로그인했을 때 디바이스 토큰
export const refreshDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/refresh', { token });
    return response.data;
};

// 알림 활성화
export const activateDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/activate', { token });
    return response.data;
};

// 알림 비활성화
export const deactivateDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/deactivate', { token });
    return response.data;
};
