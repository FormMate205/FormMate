import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '@/entities/auth/model/authService';
import { useUserStore } from '@/entities/user/model/userStore';
import { Icons } from '@/shared';
import api from '@/shared/api/instance';

interface AccountData {
    bankName: string;
    accountNumber: string;
    balance: number;
}

const fetchAccountInfo = async (): Promise<AccountData> => {
    const { data } = await api.get('/users/account');
    return data;
};

const AccountInfo = () => {
    const navigate = useNavigate();
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;
    const isValid = token ? isTokenValid() : false;

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['accountInfo'],
        queryFn: fetchAccountInfo,
        retry: false,
        enabled: isValid,
    });

    useEffect(() => {
        if (user && !isLoading) {
            const hasAccount = !isError && !!data;
            if (user.hasAccount !== hasAccount) {
                setUser({
                    ...user,
                    hasAccount,
                });
            }
        }
    }, [data, isError, isLoading, user, setUser]);

    // 토큰이 유효하지 않으면 계좌 등록 UI 표시
    if (!isValid) {
        return (
            <div className='bg-primary-500 flex items-center justify-between rounded-lg p-2 shadow-sm'>
                <div className='flex w-full items-center justify-between p-3'>
                    <div>
                        <p className='text-line-100 text-sm'>
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

    if (isLoading) {
        return <div className='text-sm'>계좌 정보를 불러오는 중...</div>;
    }

    if (isError || !data) {
        return (
            <div className='bg-primary-500 flex items-center justify-between rounded-lg p-2 shadow-sm'>
                <div className='flex w-full items-center justify-between p-3'>
                    <div>
                        <p className='text-line-100 text-sm'>
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
        <div className='bg-primary-500 flex items-center justify-between rounded-lg p-2 shadow-sm'>
            <div className='flex w-full items-center justify-between p-3'>
                <div>
                    <p className='text-line-100 text-sm'>
                        {data.bankName} {data.accountNumber}
                    </p>
                    <p className='text-3xl font-semibold text-white'>
                        {(data.balance ?? 0).toLocaleString()}원
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
