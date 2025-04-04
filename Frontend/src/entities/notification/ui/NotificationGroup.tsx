import { NotificationItemProps } from '../model/types';
import NotificationItem from './NotificationItem';

type NotificationGroupProps = {
    label: string;
    notifications: NotificationItemProps[];
    bgColor?: string;
    getItemRef?: (
        idx: number,
    ) => ((node: HTMLDivElement | null) => void) | null;
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
                {notifications.length === 0 ? (
                    <div className='text-line-500 px-4 py-6 text-sm'>
                        {label === '읽지 않은 알림'
                            ? '읽지 않은 알림이 없습니다.💤'
                            : '이전 알림이 없습니다.💤'}
                    </div>
                ) : (
                    notifications.map((n, idx) => (
                        <NotificationItem
                            key={n.alertId ?? idx}
                            ref={getItemRef?.(idx) ?? undefined}
                            {...n}
                        />
                    ))
                )}
            </div>
        </article>
    );
};

export default NotificationGroup;
