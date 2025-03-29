import { NotificationItemProps } from '@/entities/notification/model/types';
import NotificationGroup from '@/entities/notification/ui/NotificationGroup';
import { Footer, Header } from '@/widgets';

const todayNotifications: NotificationItemProps[] = [
    {
        icon: 'exclamation',
        title: '연체가 발생했습니다!',
        content: '윤이영님과의 계약이 제대로 이행되지 않았습니다.',
        iconColorClass: 'fill-line-900',
    },
    {
        icon: 'message',
        title: '오늘은 상환일입니다!',
        content: '윤이영님께 1,000원을 이체하세요!',
        iconColorClass: 'fill-line-900',
    },
];

const pastNotifications: NotificationItemProps[] = [
    {
        icon: 'message',
        title: '오늘은 상환일입니다!',
        content: '윤이영님께 1,000원을 이체하세요!',
        iconColorClass: 'fill-line-700',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        iconColorClass: 'fill-line-700',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        iconColorClass: 'fill-line-700',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        iconColorClass: 'fill-line-700',
    },
    {
        icon: 'contract',
        title: '강지은(7895)의 통장',
        content: '출금 12,000원 | 윤이영',
        iconColorClass: 'fill-line-700',
    },
];

const Notifications = () => {
    return (
        <div className='flex h-screen flex-col justify-between py-2'>
            <section>
                <div className='px-4'>
                    <Header title='알림' />
                </div>

                <div className='flex flex-col gap-6 py-4'>
                    <NotificationGroup
                        label='오늘'
                        notifications={todayNotifications}
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
