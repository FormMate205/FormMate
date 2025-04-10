import { lazy, Suspense } from 'react';
import { useContractAmount } from '@/entities/home/model/useContractAmount';
import { useUserStore } from '@/entities/user/model/userStore';
import AccountInfoSkeleton from '@/features/home/ui/AccountInfoSkeleton';
import ScheduleSkeleton from '@/features/home/ui/ScheduleSkeleton';
import TodaySettlementSkeleton from '@/features/home/ui/TodaySettlementSkeleton';
import { useUnreadNotificationCount } from '@/features/notifications/api/NotificationAPI';
import { Footer, Header } from '@/widgets';

interface HomeProps {
    userName: string;
}

const AccountInfo = lazy(() => import('@/features/home/ui/AccountInfo'));
const Schedule = lazy(() => import('@/features/home/ui/Schedule'));
const TodaySettlement = lazy(
    () => import('@/features/home/ui/TodaySettlement'),
);

const Home = ({ userName }: HomeProps) => {
    userName = useUserStore((state) => state.user?.userName ?? '사용자');
    const { data: unreadAlert } = useUnreadNotificationCount();
    const { data: accountInfo } = useContractAmount();

    return (
        <div className='flex h-screen flex-col'>
            <div className='bg-line-50 scrollbar-none w-full flex-1 overflow-y-auto px-4 py-2'>
                <Header
                    title='FormMate'
                    isHome={true}
                    unreadCount={unreadAlert?.unreadAlertCount}
                />
                <div className='flex flex-col gap-7'>
                    <div className='relative mt-2'>
                        <p className='text-2xl font-semibold'>
                            {userName}님의
                            <br />
                            금전 거래
                        </p>
                        <img
                            src='/assets/images/cones.png'
                            alt='축하 이미지'
                            className='absolute top-0 right-0 h-16 w-16'
                        />
                    </div>

                    <Suspense fallback={<AccountInfoSkeleton />}>
                        <AccountInfo />
                    </Suspense>

                    <Suspense fallback={<TodaySettlementSkeleton />}>
                        {accountInfo && <TodaySettlement data={accountInfo} />}
                    </Suspense>

                    <Suspense fallback={<ScheduleSkeleton />}>
                        <Schedule />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
