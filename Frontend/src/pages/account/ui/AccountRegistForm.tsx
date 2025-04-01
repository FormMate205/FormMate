import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const AccountRegist = () => {
    const [accountNum, setAccountNum] = useState('');
    const [bank, setBank] = useState('');
    const navigate = useNavigate();

    const bankOptions = ['ㄷㄷ은행', 'ㄱㄱ은행', 'ㅇㅇ은행', 'ㅁㅁ은행'];

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='scrollbar-none relative flex h-full flex-col gap-2 overflow-y-auto px-4 py-2'>
                <Header title='계좌 등록' />
                <div className='flex flex-col p-2'>
                    <h2 className='my-8 text-xl font-semibold'>
                        계좌를 연결하세요.
                    </h2>

                    <input
                        type='text'
                        placeholder='계좌번호 입력'
                        value={accountNum}
                        onChange={(e) => setAccountNum(e.target.value)}
                        className={`w-full border-b py-3 focus:ring-0 focus:outline-none ${accountNum ? 'border-primary-500' : 'border-line-300'}`}
                    />

                    {/* 은행 선택 */}
                    <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className={`mt-6 w-full border-b py-3 focus:ring-0 focus:outline-none ${bank ? 'border-primary-500' : 'border-line-300'}`}
                    >
                        <option value=''>은행 선택</option>
                        {bankOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {accountNum && bank && (
                        <div className='absolute bottom-0 left-0 w-full p-6'>
                            <Button
                                className='w-full'
                                variant='primary'
                                onClick={() => navigate('/account/verify')}
                            >
                                1원 보내기
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountRegist;
