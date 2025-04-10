import { useEffect } from 'react';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { useGetUserDetail } from '@/entities/auth/api/getUserDetail';
import { useUserStore } from '@/entities/user/model/userStore';
import SubscriptionToggle from '@/features/myInfo/ui/NotificationToggle';
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
        <div className='flex flex-col h-screen'>
            <div className='flex-1 w-full px-4 py-2 overflow-y-auto bg-line-50 scrollbar-none'>
                {' '}
                <Header title='내 정보' />
                <div className='flex flex-col h-full gap-6 overflow-y-auto scrollbar-none'>
                    <MyAccount />
                    <SubscriptionToggle />
                    <div className='mt-4'>
                        {userDetail && (
                            <>
                                <UserInfo
                                    isOAuth={userDetail.provider !== 'LOCAL'}
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
