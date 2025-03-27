import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const EnterAmount = () => {
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
            <Header title='송금 금액 입력' />
            <section className='mt-20 flex flex-col gap-12 px-2'>
                <div className='flex flex-col'>
                    <span className='text-2xl font-semibold'>강지은님께</span>
                    <span className='text-line-700 text-lg font-medium'>
                        상환 예정액: 200,000원
                    </span>
                </div>
                <div className='flex flex-col gap-4'>
                    <input
                        type='text'
                        placeholder='얼마를 보낼까요?'
                        className='border-line-300 placeholder:text-line-300 w-full border-b-2 py-3 text-2xl font-semibold outline-none'
                    />
                    <div className='flex justify-center'>
                        <Button variant={'choiceEmpty'}>상환액 20,000원</Button>
                    </div>
                </div>
            </section>
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
                    onClick={() => navigate('/transfer/password')}
                >
                    확인
                </Button>
            </div>
        </div>
    );
};

export default EnterAmount;
