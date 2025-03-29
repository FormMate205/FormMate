import { Icons } from '@/shared';
import { NotificationItemProps } from '../model/types';

const NotificationItem = ({
    icon,
    title,
    content,
    iconColorClass,
}: NotificationItemProps) => {
    return (
        <div className='border-line-300 flex gap-4 border-b p-4'>
            <Icons name={icon} className={`${iconColorClass} mt-0.5`} />
            <div className='flex flex-col gap-0.5'>
                <span className='font-semibold'>{title}</span>
                <span className='text-line-600'>{content}</span>
            </div>
        </div>
    );
};

export default NotificationItem;
