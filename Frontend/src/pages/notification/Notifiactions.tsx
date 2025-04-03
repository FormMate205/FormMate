import { mapNotificationListToItems } from '@/entities/notification/model/mapNotificationItem';
import { NotificationItemProps } from '@/entities/notification/model/types';
import NotificationGroup from '@/entities/notification/ui/NotificationGroup';
import { useGetUnreadNotificationList } from '@/features/notifications/api/NotificationAPI';
import { Footer, Header } from '@/widgets';

const pastNotifications: NotificationItemProps[] = [
    {
        icon: 'message',
        title: '오늘은 상환일입니다!',
        content: '윤이영님께 1,000원을 이체하세요!',
        createdAt: '2025-01-01',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        createdAt: '2025-01-01',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        createdAt: '2025-01-01',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        createdAt: '2025-01-01',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        createdAt: '2025-01-01',
    },
];

const Notifications = () => {
    const { data: unread } = useGetUnreadNotificationList();
    const unreadNotifications = mapNotificationListToItems(unread ?? []);

    return (
        <div className='flex h-screen flex-col justify-between py-2'>
            <section>
                <div className='px-4'>
                    <Header title='알림' />
                </div>

                <div className='flex flex-col gap-6 py-4'>
                    <NotificationGroup
                        label='읽지 않은 알림'
                        notifications={unreadNotifications}
                        bgColor='bg-primary-50'
                    />
                    <NotificationGroup
                        label='이전 알림'
                        notifications={pastNotifications}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Notifications;
