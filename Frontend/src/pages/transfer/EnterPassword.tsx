import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NumberPad from '@/shared/ui/NumberPad';
import PasswordDots from '@/shared/ui/PasswordDots';
import { Header } from '@/widgets';

const EnterPassword = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const handleNumberClick = (num: string) => {
        if (inputValue.length >= 6) return;
        setInputValue((prev) => prev + num);
    };
    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    return (
        <div className='relative flex h-full flex-col justify-between px-4 py-2'>
            <Header title='송금 비밀번호 입력' />

            <div className='flex flex-col justify-center p-6'>
                <span className='text-center text-xl font-semibold'>
                    결제 비밀번호를 입력하세요
                </span>
                <PasswordDots inputValue={inputValue} />
            </div>
            <div className='sticky bottom-0 left-0 mx-auto flex w-full max-w-[640px] flex-col gap-6 pb-6'>
                {/* 숫자 키패드 */}
                <NumberPad
                    onDelete={handleDelete}
                    onNumberClick={handleNumberClick}
                />

                <Button
                    variant='primary'
                    onClick={() => navigate('/transfer/complete')}
                >
                    확인
                </Button>
            </div>
        </div>
    );
};

export default EnterPassword;
