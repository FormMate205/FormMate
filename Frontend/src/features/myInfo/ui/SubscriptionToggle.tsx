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
