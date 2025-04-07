import { refreshDeviceToken } from '@/features/notifications/api/deviceTokenAPI';
import { requestPermission } from './firebase';

// 로그인시 FCM 토큰 갱신
export const refreshToken = async () => {
    const token = await requestPermission();
    if (!token) return;

    await refreshDeviceToken(token);
};
