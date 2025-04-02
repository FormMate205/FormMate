import { useEffect } from 'react';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { useUserStore } from '@/entities/user/model/userStore';
import { Footer, Header } from '@/widgets';
import AddressInfo from './ui/AddressInfo';
import Logout from './ui/Logout';
import MyAccount from './ui/MyAccount';
import UserInfo from './ui/UserInfo';

const MyInfo = () => {
    // 임시 데이터 (API 연결 후 대체)
    const userData = {
        userName: '강지은',
        phoneNumber: '010-1234-1234',
        email: 'ggsilver@naver.com',
        isOAuth: false,
        hasAccount: true,
        accountNumber: '싸피뱅크 111-11111-11111',
        zipCode: '12321',
        address: '서울 강남구 테헤란로 212',
        detailAddress: '멀티캠퍼스 802호',
    };

    const { data: accountInfo, isLoading, isError } = useGetAccountInfo();
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

                    <div className='mt-4'>
                        <UserInfo
                            isOAuth={userData.isOAuth}
                            userName={userData.userName}
                            phoneNumber={userData.phoneNumber}
                            email={userData.email}
                        />
                        <AddressInfo
                            zipCode={userData.zipCode}
                            address={userData.address}
                            detailAddress={userData.detailAddress}
                        />
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
