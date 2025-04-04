// entities/notification/ui/NotificationGroup.tsx
import { NotificationItemProps } from '../model/types';
import NotificationItem from './NotificationItem';

type NotificationGroupProps = {
    label: string;
    notifications: NotificationItemProps[];
    bgColor?: string;
    getItemRef?: (index: number) => React.Ref<HTMLDivElement> | null;
};

const NotificationGroup = ({
    label,
    notifications,
    bgColor,
    getItemRef,
}: NotificationGroupProps) => {
    return (
        <article className='flex flex-col gap-2'>
            <span className='px-4 text-lg font-medium'>{label}</span>
            <div className={`${bgColor ?? ''} border-line-200 border-t`}>
                {notifications.map((n, idx) => (
                    <NotificationItem
                        key={n.alertId}
                        {...n}
                        ref={getItemRef?.(idx) ?? undefined}
                    />
                ))}
            </div>
        </article>
    );
};

export default NotificationGroup;
