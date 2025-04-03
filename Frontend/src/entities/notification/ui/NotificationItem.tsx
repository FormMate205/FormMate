import { Icons } from '@/shared';
import { NotificationItemProps } from '../model/types';

const NotificationItem = ({
    icon,
    title,
    content,
    createdAt,
}: NotificationItemProps) => {
    return (
        <div className='border-line-300 flex gap-4 border-b p-4'>
            <Icons name={icon} className='fill-line-900 mt-0.5' />
            <div className='flex flex-1 flex-col gap-0.5'>
                <div className='flex justify-between'>
                    <span className='font-semibold'>{title}</span>
                    <span className='text-line-600'>{createdAt}</span>
                </div>
                <span className='text-line-600'>{content}</span>
            </div>
        </div>
    );
};

export default NotificationItem;
