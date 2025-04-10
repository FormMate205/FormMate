import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { isTokenValid } from '@/entities/auth/model/authService';
import { useUserStore } from '@/entities/user/model/userStore';
import { Icons } from '@/shared';
import { formatCurrency } from '@/shared/lib/formatCurrency';

const AccountInfo = () => {
    const navigate = useNavigate();
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;
    const isValid = token ? isTokenValid() : false;

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

    // 토큰이 유효하지 않으면 계좌 등록 UI 표시
    if (!isValid) {
        return (
            <div className='flex items-center justify-between p-2 rounded-lg shadow-sm bg-primary-500'>
                <div className='flex items-center justify-between w-full p-3'>
                    <div>
                        <p className='text-sm text-line-100'>
                            등록된 계좌가 없어요
                        </p>
                        <p className='text-2xl font-semibold text-white'>
                            내 계좌 등록하기
                        </p>
                    </div>
                    <Icons
                        name='chev-right'
                        className='fill-white'
                        onClick={() => navigate('/account')}
                    />
                </div>
            </div>
        );
    }

    if (isError || !accountInfo) {
        return (
            <div className='flex items-center justify-between p-2 rounded-lg shadow-sm bg-primary-500'>
                <div className='flex items-center justify-between w-full p-3'>
                    <div>
                        <p className='text-sm text-line-100'>
                            등록된 계좌가 없어요
                        </p>
                        <p className='text-2xl font-semibold text-white'>
                            내 계좌 등록하기
                        </p>
                    </div>
                    <Icons
                        name='chev-right'
                        className='fill-white'
                        onClick={() => navigate('/account')}
                    />
                </div>
            </div>
        );
    }
    return (
        <div className='flex items-center justify-between p-2 rounded-lg shadow-sm bg-primary-500'>
            <div className='flex items-center justify-between w-full p-3'>
                <div>
                    <p className='text-sm text-line-100'>
                        {accountInfo.bankName} {accountInfo.accountNumber}
                    </p>
                    <p className='text-3xl font-semibold text-white'>
                        {formatCurrency(accountInfo.accountBalance ?? 0)}
                    </p>
                </div>
                <div>
                    <Icons
                        name='chev-right'
                        className='fill-white'
                        onClick={() => navigate('/transaction')}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
