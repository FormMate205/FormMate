import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { checkAccount } from '@/entities/account/api/checkAccount';
import { Header } from '@/widgets';

const AccountRegist = () => {
    const [accountNum, setAccountNum] = useState('');
    const [bank, setBank] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const bankOptions = [
        '기업은행',
        '국민은행',
        '농협은행',
        '우리은행',
        '새마을금고',
        'KEB하나은행',
        '신한은행',
        '카카오뱅크',
    ];

    const handleSubmit = async () => {
        setError('');
        try {
            await checkAccount({ bankName: bank, accountNumber: accountNum });
            navigate('/account/verify', {
                state: {
                    bankName: bank,
                    accountNumber: accountNum,
                },
            });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(
                error.response?.data?.message ||
                    '계좌 확인 중 오류가 발생했습니다.',
            );
        }
    };

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
                        className={`w-full border-b py-3 focus:ring-0 focus:outline-none ${
                            accountNum
                                ? 'border-primary-500'
                                : 'border-line-300'
                        }`}
                    />

                    {/* <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className={`mt-6 w-full border-b py-3 focus:ring-0 focus:outline-none ${
                            bank ? 'border-primary-500' : 'border-line-300'
                        }`}
                    >
                        <option value=''>은행 선택</option>
                        {bankOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select> */}

                    <div className='relative mt-6'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`w-full border-b py-3 text-left focus:outline-none ${
                                        bank
                                            ? 'border-primary-500 text-black'
                                            : 'border-line-300 text-gray-400'
                                    }`}
                                >
                                    {bank || '은행 선택'}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className='w-[var(--radix-dropdown-menu-trigger-width)] bg-white'
                                align='start'
                            >
                                {bankOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onSelect={() => setBank(option)}
                                        className='w-full px-4 py-2 text-sm hover:bg-gray-100'
                                    >
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {error && (
                        <p className='text-destructive mt-4 text-sm'>{error}</p>
                    )}

                    {accountNum && bank && (
                        <div className='absolute bottom-0 left-0 w-full p-6'>
                            <Button
                                className='w-full'
                                variant='primary'
                                onClick={handleSubmit}
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
