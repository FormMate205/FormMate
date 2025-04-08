import { Switch } from '@/components/ui/switch';
import { useNotificationToggle } from '@/features/notifications/model/useNotificationToggle';

const NotificationToggle = () => {
    const { isSubscribed, isMutating, isPermissionDenied, toggle } =
        useNotificationToggle();

    if (isSubscribed === undefined) return null;

    return (
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>알림 설정</h2>
            <div className='text-line-950 flex items-center justify-between rounded-lg bg-white p-4 text-sm'>
                알림 받기
                <Switch
                    checked={!!isSubscribed}
                    onCheckedChange={toggle}
                    disabled={isMutating || isPermissionDenied}
                />
            </div>
            {isPermissionDenied && (
                <div className='text-primary-500 text-xs'>
                    브라우저 알림 권한이 꺼져 있어요. 설정에서 허용해주세요.
                </div>
            )}
        </div>
    );
};

export default NotificationToggle;
