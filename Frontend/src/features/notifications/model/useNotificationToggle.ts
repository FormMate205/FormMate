import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getDeviceToken } from '@/lib/firebase';
import {
    useActivateDeviceToken,
    useDeactivateDeviceToken,
    useGetSubscription,
} from '../api/deviceTokenAPI';

export const useNotificationToggle = () => {
    const { data: isSubscribed } = useGetSubscription(); // 서버 기준 구독 여부

    // 활성화/비활성화 요청
    const { mutateAsync: activate, isPending: isActivating } =
        useActivateDeviceToken();
    const { mutateAsync: deactivate, isPending: isDeactivating } =
        useDeactivateDeviceToken();
    const isMutating = isActivating || isDeactivating;

    // 브라우저 알림 권한 상태
    const [permission, setPermission] = useState<NotificationPermission>(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            return Notification.permission;
        }
        return 'default';
    });
    const isPermissionDenied = permission === 'denied';

    // 마이페이지 진입 시 권한 상태 확인 + DB 업데이트
    useEffect(() => {
        if (permission === 'denied') {
            deactivate(); // 서버에 구독해제 요청
        }
    }, [permission, deactivate]);

    // 권한 없을 때 공통 경고 메시지
    const showPermissionWarning = () => {
        toast.warning('알림 권한이 허용되지 않았어요.', {
            description: '브라우저 설정에서 알림 권한을 허용해야 해요!',
        });
    };

    // 토글 함수
    const toggle = async () => {
        const isTryingToSubscribe = !isSubscribed;
        // 알림을 구독하려는 경우
        if (isTryingToSubscribe) {
            // 브라우저에서 권한 차단한 경우
            if (permission === 'denied') {
                showPermissionWarning();
                return;
            }

            // 브라우저에서 요청 상태가 없는 경우
            if (permission === 'default') {
                const result = await Notification.requestPermission();
                setPermission(result); // 권한 요청 후 상태 업데이트
                if (result !== 'granted') {
                    showPermissionWarning();
                    return;
                }
            }
        }
        // granted일 경우 디바이스 토큰 발급
        const token = await getDeviceToken();
        if (!token) {
            showPermissionWarning();
            return;
        }

        try {
            if (isSubscribed) {
                await deactivate();
                toast.message('🔕 알림 구독이 해제됐어요.');
            } else {
                await activate(token);
                toast.message('🔔 이제 알림을 받아볼 수 있어요!');
            }
        } catch {
            toast.error('알림 설정 중 오류가 발생했어요.');
        }
    };

    return {
        isSubscribed,
        isMutating,
        isPermissionDenied,
        toggle,
    };
};
