import { Switch } from '@/components/ui/switch';

const SubscriptionToggle = () => {
    return (
        <div className='flex items-center justify-between rounded-lg bg-white p-4'>
            알림 수신
            <Switch />
        </div>
    );
};
export default SubscriptionToggle;
