import { toast } from 'sonner';
import { getDeviceToken } from '@/lib/firebase';
import {
    useActivateDeviceToken,
    useDeactivateDeviceToken,
    useGetSubscription,
} from '../api/deviceTokenAPI';

export const useNotificationToggle = () => {
    const { data: isSubscribed, refetch } = useGetSubscription();
    const { mutateAsync: activate, isPending: isActivating } =
        useActivateDeviceToken();
    const { mutateAsync: deactivate, isPending: isDeactivating } =
        useDeactivateDeviceToken();

    const isMutating = isActivating || isDeactivating;

    const showPermissionWarning = () => {
        toast.warning('알림 권한이 허용되지 않았어요.', {
            description: '브라우저 설정에서 알림 권한을 허용해야 해요!',
        });
    };

    const toggle = async () => {
        const isTryingToSubscribe = !isSubscribed;

        if (isTryingToSubscribe) {
            if (Notification.permission === 'denied') {
                showPermissionWarning();
                return;
            }

            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    showPermissionWarning();
                    return;
                }
            }
        }

        const token = await getDeviceToken();
        if (!token) {
            showPermissionWarning();
            return;
        }

        try {
            if (isSubscribed) {
                await deactivate(token);
                toast.message('🔕 알림 구독이 해제됐어요.');
            } else {
                await activate(token);
                toast.message('🔔 이제 알림을 받아볼 수 있어요!');
            }

            await refetch();
        } catch (error) {
            toast.error('알림 설정 중 오류가 발생했어요.');
            console.error(error);
        }
    };

    return {
        isSubscribed,
        isMutating,
        toggle,
    };
};
