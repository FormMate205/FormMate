import { Switch } from '@/components/ui/switch';
import {
    useActivateDeviceToken,
    useDeactivateDeviceToken,
    useGetSubscription,
} from '@/features/notifications/api/deviceTokenAPI';
import { getDeviceToken } from '@/lib/firebase';

const SubscriptionToggle = () => {
    const { data: isSubscribed } = useGetSubscription();
    const { mutate: activate } = useActivateDeviceToken();
    const { mutate: deactivate } = useDeactivateDeviceToken();

    const handleToggle = async () => {
        const isTryingToSubscribe = !isSubscribed;
        // 알림을 구독하려고 했을 때
        if (isTryingToSubscribe) {
            if (Notification.permission === 'denied') {
                alert(
                    '브라우저 알림 권한이 차단되어 있어요.\n설정에서 알림을 허용해주세요!',
                );
                return;
            }

            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert(
                        '알림 권한이 허용되지 않았어요.\n' +
                            '알림을 받으려면 브라우저에서 권한을 허용해야 해요!',
                    );
                    return;
                }
            }
        }

        const token = await getDeviceToken();
        if (!token) {
            alert('알림 권한이 허용되지 않았습니다.');
            return;
        }
        if (isSubscribed) {
            deactivate(token);
        } else {
            activate(token);
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>알림 설정</h2>
            <div className='text-line-950 flex items-center justify-between rounded-lg bg-white p-4 text-sm'>
                알림 받기
                {/* toDo: onCheckedChange={handleToggle} */}
                <Switch checked={isSubscribed} onCheckedChange={handleToggle} />
            </div>
        </div>
    );
};
export default SubscriptionToggle;
