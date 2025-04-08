// features/notifications/ui/SubscriptionToggle.tsx
import { Switch } from '@/components/ui/switch';
import { useNotificationToggle } from '@/features/notifications/model/useNotificationToggle';

const SubscriptionToggle = () => {
    const { isSubscribed, isMutating, toggle } = useNotificationToggle();

    if (isSubscribed === undefined) return null;

    return (
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>알림 설정</h2>
            <div className='text-line-950 flex items-center justify-between rounded-lg bg-white p-4 text-sm'>
                알림 받기
                <Switch
                    checked={!!isSubscribed}
                    onCheckedChange={toggle}
                    disabled={isMutating}
                />
            </div>
        </div>
    );
};

export default SubscriptionToggle;
