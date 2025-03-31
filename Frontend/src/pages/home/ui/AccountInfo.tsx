import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
    const { data, isLoading, isError } = useQuery({
        queryKey: ['accountInfo'],
        queryFn: fetchAccountInfo,
        retry: false,
    });

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
