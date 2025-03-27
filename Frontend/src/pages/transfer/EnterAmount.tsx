import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AmountInput from '@/features/transfer/ui/AmountInput';
import NumberPad from '@/shared/ui/NumberPad';
import { Header } from '@/widgets';

const EnterAmount = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const handleNumberClick = (num: string) => {
        setInputValue((prev) => prev + num);
    };
    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };
    const handleRecommendClick = () => {
        setInputValue('20000');
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
                <AmountInput
                    inputValue={inputValue}
                    recommendAmount={200000}
                    onRecommendClick={handleRecommendClick}
                />
            </section>
            <div className='fixed bottom-0 left-0 flex w-full flex-col gap-6 px-6 pb-6'>
                <div className='flex justify-between px-3'>
                    <div className='bg-line-100 rounded-2xl px-4 py-2'>
                        + 1만
                    </div>
                    <div className='bg-line-100 rounded-2xl px-4 py-2'>
                        + 5만
                    </div>
                    <div className='bg-line-100 rounded-2xl px-4 py-2'>
                        + 10만
                    </div>
                    <div className='bg-line-100 rounded-2xl px-4 py-2'>
                        + 50만
                    </div>
                </div>
                <NumberPad
                    onNumberClick={handleNumberClick}
                    onDelete={handleDelete}
                />
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
