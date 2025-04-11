import { Suspense, useEffect } from 'react';
import { mapNotificationListToItems } from '@/entities/notification/model/mapNotificationItem';
import NotificationGroup from '@/entities/notification/ui/NotificationGroup';
import {
    useGetNotificationList,
    useGetUnreadNotificationList,
    useUpdateNotificationList,
} from '@/features/notifications/api/NotificationAPI';
import { getMinAlertId } from '@/features/notifications/model/getMinAlertId';
import ListLoading from '@/shared/ui/ListLoading';
import { Header } from '@/widgets';

const Notifications = () => {
    // 읽지 않은 알림 호출
    const { data: unread } = useGetUnreadNotificationList();
    const unreadNotifications = mapNotificationListToItems(unread ?? []);
    const minAlertId = getMinAlertId(unread);

    // 읽지 않은 알림 서버에 읽음 처리
    const { mutate: markAllAsRead } = useUpdateNotificationList();
    useEffect(() => {
        if (unread && unread.length > 0) {
            markAllAsRead();
        }
    }, [unread, markAllAsRead]);

    // 읽은 알림 호출
    const { notifications: read, lastItemRef } = useGetNotificationList({
        alertId: minAlertId,
        pageable: {
            page: '0',
            size: '10',
        },
    });
    const readNotifications = mapNotificationListToItems(read);
    const lastIndex = readNotifications.length - 1;

    return (
        <div className='flex h-screen flex-col justify-between py-2'>
            <section>
                <div className='px-4'>
                    <Header title='알림' />
                </div>

                <div className='flex flex-col gap-6 py-4'>
                    <Suspense fallback={<ListLoading />}>
                        <NotificationGroup
                            label='읽지 않은 알림'
                            notifications={unreadNotifications}
                            bgColor='bg-primary-50'
                        />
                    </Suspense>
                    <Suspense fallback={<ListLoading />}>
                        <NotificationGroup
                            label='이전 알림'
                            notifications={readNotifications}
                            getItemRef={(idx) =>
                                idx === lastIndex ? lastItemRef : null
                            }
                        />
                    </Suspense>
                </div>
            </section>
        </div>
    );
};

export default Notifications;
