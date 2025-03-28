import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AmountInput from '@/features/transfer/ui/AmountInput';
import NumberPad from '@/shared/ui/NumberPad';
import { Header } from '@/widgets';

const EnterAmount = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const recommendAmount = 200000;
    const currentAmount = parseInt(inputValue || '0', 10);
    const difference = currentAmount - recommendAmount;

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
        <div className='flex flex-col px-4 py-2'>
            <Header title='송금 금액 입력' />
            <section className='mt-20 flex flex-col gap-12 px-2'>
                <div className='flex flex-col'>
                    <span className='text-2xl font-semibold'>강지은님께</span>
                    <span className='text-line-700 text-lg font-medium'>
                        상환 예정액: {recommendAmount.toLocaleString()}원
                    </span>
                </div>
                <div className='flex flex-col gap-4'>
                    <AmountInput inputValue={inputValue} />
                    <div className='flex justify-start'>
                        {!inputValue ? (
                            <Button
                                variant='choiceEmpty'
                                onClick={handleRecommendClick}
                            >
                                상환액 20000원
                            </Button>
                        ) : difference === 0 ? (
                            <span className='text-base font-medium text-gray-700'>
                                정확한 상환액입니다
                            </span>
                        ) : (
                            <div className='flex items-center gap-2 font-medium text-gray-700'>
                                <div className='border-line-500 rounded-xl border px-3 py-1'>
                                    차액
                                </div>
                                <div className='text-lg font-medium'>
                                    {difference > 0 ? (
                                        <span className='text-primary-500'>
                                            +{' '}
                                            {Math.abs(
                                                difference,
                                            ).toLocaleString()}
                                            원
                                        </span>
                                    ) : (
                                        <span className='text-subPink-600'>
                                            -
                                            {Math.abs(
                                                difference,
                                            ).toLocaleString()}
                                            원
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 금액 추가 버튼들 */}
            <div className='fixed bottom-0 flex w-full max-w-[640px] flex-col gap-6 px-6 pb-6'>
                <div className='flex justify-between px-3'>
                    {[10000, 50000, 100000, 500000].map((amt) => (
                        <div
                            key={amt}
                            className='bg-line-100 cursor-pointer rounded-2xl px-4 py-2'
                            onClick={() => handleAmountAdd(amt)}
                        >
                            + {(amt / 10000).toFixed(0)}만
                        </div>
                    ))}
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
