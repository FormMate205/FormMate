import { Switch } from '@/components/ui/switch';
import { useGetSubscription } from '@/features/notifications/api/deviceTokenAPI';

const SubscriptionToggle = () => {
    const { data: isSubscribed } = useGetSubscription();
    //const { mutate: activate } = useActivateDeviceToken();
    //const { mutate: deactivate } = useDeactivateDeviceToken();

    // toDo: getDeviceToken 으로 디바이스 토큰 가져와야함함

    // const handleToggle = () => {
    //     const token = await getDeviceToken();
    //     if(!token) return;
    //     if (isSubscribed) {
    //         deactivate(token);
    //     } else {
    //         activate(token);
    //     }
    // };

    return (
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>알림 설정</h2>
            <div className='text-line-950 flex items-center justify-between rounded-lg bg-white p-4 text-sm'>
                알림 받기
                {/* toDo: onCheckedChange={handleToggle} */}
                <Switch checked={isSubscribed} />
            </div>
        </div>
    );
};
export default SubscriptionToggle;
