import { Switch } from '@/components/ui/switch';

const SubscriptionToggle = () => {
    return (
        <div className='text-line-950 flex items-center justify-between rounded-lg bg-white p-4 text-sm'>
            알림 받기
            <Switch />
        </div>
    );
};
export default SubscriptionToggle;
