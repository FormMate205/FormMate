import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
        <div className='flex flex-col px-4 py-2'>
            <Header title='송금 비밀번호 입력' />
            <div className='fixed bottom-0 left-0 w-full px-6 pb-6'>
                {/* 숫자 키패드 */}
                <div className='mb-10 grid grid-cols-3 gap-8 text-center text-2xl'>
                    {[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '',
                        '0',
                        '←',
                    ].map((num) =>
                        num === '←' ? (
                            <div
                                key={num}
                                onClick={handleDelete}
                                className='cursor-pointer'
                            >
                                ←
                            </div>
                        ) : (
                            <div
                                key={num}
                                onClick={() => handleNumberClick(num)}
                                className='cursor-pointer'
                            >
                                {num}
                            </div>
                        ),
                    )}
                </div>

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
