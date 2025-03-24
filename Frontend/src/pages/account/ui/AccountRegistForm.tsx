import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { ArrowListItem } from '@/shared/ui/ArrowListItem';

const AccountRegist = () => {
    const [accountNum, setAccountNum] = useState('');
    const [bank, setBank] = useState('');
    const navigate = useNavigate();

    const bankOptions = ['ㄷㄷ은행', 'ㄱㄱ은행', 'ㅇㅇ은행', 'ㅁㅁ은행'];

    return (
        <div className='p-6'>
            <h2 className='mt-8 mb-4 text-lg font-semibold'>
                계좌를 연결하세요.
            </h2>

            <input
                type='text'
                placeholder='계좌번호 입력'
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                className={`w-full border-b py-3 ${accountNum ? 'border-primary-500' : 'border-line-300'}`}
            />

            {/* 은행 선택 */}
            <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className={`mt-6 w-full border-b py-3 ${bank ? 'border-primary-500' : 'border-line-300'}`}
            >
                <option value=''>은행 선택</option>
                {bankOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            {accountNum && bank && (
                <div className='fixed bottom-0 left-0 w-full p-6'>
                    <Button
                        className='w-full'
                        variant='primary'
                        onClick={() => navigate('/account/regist/verify')}
                    >
                        1원 보내기
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AccountRegist;
