import { refreshDeviceToken } from '@/features/notifications/api/deviceTokenAPI';
import { getDeviceToken } from './firebase';

// 로그인시 FCM 토큰 갱신
export const refreshToken = async () => {
    const token = await getDeviceToken();
    if (!token) return;

    await refreshDeviceToken(token);
};
