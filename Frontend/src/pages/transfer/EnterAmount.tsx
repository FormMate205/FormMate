import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AmountDifference from '@/features/transfer/ui/amount/AmountDifference';
import AmountInput from '@/features/transfer/ui/amount/AmountInput';
import AmountShortcuts from '@/features/transfer/ui/amount/AmountShortcuts';
import NumberPad from '@/shared/ui/NumberPad';
import { Header } from '@/widgets';

const EnterAmount = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const recommendAmount = 200000;

    const handleNumberClick = (num: string) => {
        setInputValue((prev) => prev + num);
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleRecommendClick = () => {
        setInputValue('20000');
    };

    const handleAmountAdd = (amount: number) => {
        const current = parseInt(inputValue || '0', 10);
        const updated = current + amount;
        setInputValue(String(updated));
    };

    return (
        <div className='relative flex h-screen flex-col justify-between px-4 py-2'>
            <Header title='송금 금액 입력' />
            <section className='flex flex-col gap-12 px-2'>
                <div className='flex flex-col'>
                    <span className='text-2xl font-semibold'>강지은님께</span>
                    <span className='text-line-700 text-lg font-medium'>
                        상환 예정액: {recommendAmount.toLocaleString()}원
                    </span>
                </div>
                <div className='flex flex-col gap-4'>
                    <AmountInput inputValue={inputValue} />
                    <div className='flex justify-start'>
                        <AmountDifference
                            inputValue={inputValue}
                            recommendAmount={recommendAmount}
                            onRecommendClick={handleRecommendClick}
                        />
                    </div>
                </div>
            </section>

            {/* 금액 추가 버튼들 */}
            <div className='sticky bottom-0 left-0 mx-auto flex w-full max-w-[640px] flex-col gap-6 pb-6'>
                <AmountShortcuts onClick={handleAmountAdd} />
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
