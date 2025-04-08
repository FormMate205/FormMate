import { toast } from 'sonner';
import {
    deactivateDeviceToken,
    refreshDeviceToken,
} from '@/features/notifications/api/deviceTokenAPI';
import { getDeviceToken } from './firebase';

// 로그인 시 FCM 토큰 갱신
export const refreshToken = async () => {
    const token = await getDeviceToken();

    if (!token) {
        await deactivateDeviceToken(); // FCM 토큰이 없으면 구독 해제
        toast.warning('알림 권한이 꺼져있어요.', {
            description: '알림을 받으려면 브라우저에서 권한을 허용해주세요!',
        });
        return;
    }

    await refreshDeviceToken(token);
};
