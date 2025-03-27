import { NotificationItemProps } from '../model/types';
import NotificationItem from './NotificationItem';

type NotificationGroupProps = {
    label: string;
    notifications: NotificationItemProps[];
    bgColor?: string;
};

const NotificationGroup = ({
    label,
    notifications,
    bgColor,
}: NotificationGroupProps) => {
    return (
        <article className='flex flex-col gap-2'>
            <span className='px-4 text-lg font-medium'>{label}</span>
            <div className={`${bgColor ?? ''} border-line-200 border-t`}>
                {notifications.map((n, idx) => (
                    <NotificationItem key={idx} {...n} />
                ))}
            </div>
        </article>
    );
};

export default NotificationGroup;
