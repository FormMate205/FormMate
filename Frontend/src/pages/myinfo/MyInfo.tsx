import { useEffect } from 'react';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { useGetUserDetail } from '@/entities/auth/api/getUserDetail';
import { useUserStore } from '@/entities/user/model/userStore';
import SubscriptionToggle from '@/features/myInfo/ui/SubscriptionToggle';
import { Footer, Header } from '@/widgets';
import AddressInfo from '../../features/myInfo/ui/AddressInfo';
import Logout from '../../features/myInfo/ui/Logout';
import MyAccount from '../../features/myInfo/ui/MyAccount';
import UserInfo from '../../features/myInfo/ui/UserInfo';

const MyInfo = () => {
    const { data: accountInfo, isLoading, isError } = useGetAccountInfo();
    const { data: userDetail } = useGetUserDetail();

    const { user, setUser } = useUserStore();

    useEffect(() => {
        if (user && !isLoading) {
            const hasAccount = !isError && !!accountInfo;
            if (user.hasAccount !== hasAccount) {
                setUser({
                    ...user,
                    hasAccount,
                });
            }
        }
    }, [accountInfo, isError, isLoading, user, setUser]);

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none w-full flex-1 overflow-y-auto px-4 py-2'>
                {' '}
                <Header title='내 정보' />
                <div className='scrollbar-none flex h-full flex-col gap-6 overflow-y-auto'>
                    <MyAccount />
                    <SubscriptionToggle />
                    <div className='mt-4'>
                        {userDetail && (
                            <>
                                <UserInfo
                                    isOAuth={false} // 소셜 로그인 여부 판단 로직 나중에 추가
                                    userName={userDetail.userName}
                                    phoneNumber={userDetail.phoneNumber}
                                    email={userDetail.email}
                                />
                                <AddressInfo address={userDetail.address} />
                            </>
                        )}
                    </div>

                    <div className='mx-auto'>
                        <Logout />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyInfo;
