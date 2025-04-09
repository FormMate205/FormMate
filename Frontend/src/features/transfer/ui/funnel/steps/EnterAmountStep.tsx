import { useState } from 'react';
import { useGetScheduledPaymentInfo } from '@/entities/transfer/api/TransferAPI';
import AmountConfirmModal from '@/features/transfer/ui/amount/AmountConfirmModal';
import AmountDifference from '@/features/transfer/ui/amount/AmountDifference';
import AmountInput from '@/features/transfer/ui/amount/AmountInput';
import AmountShortcuts from '@/features/transfer/ui/amount/AmountShortcuts';
import NumberPad from '@/shared/ui/NumberPad';

type EnterAmountStepProps = {
    partnerName: string;
    formId: string;
    repaymentAmount: number;
    onConfirm: (amount: number) => void;
};

const EnterAmountStep = ({
    partnerName,
    formId,
    repaymentAmount,
    onConfirm,
}: EnterAmountStepProps) => {
    const [inputValue, setInputValue] = useState('');
    const { data: scheduledInfo } = useGetScheduledPaymentInfo(formId);
    const nextRepaymentAmount = scheduledInfo?.monthlyRemainingPayment ?? 0;
    const earlyRepaymentFeeRate = scheduledInfo?.earlyRepaymentFeeRate ?? 0;

    // 넘버패드 클릭
    const handleNumberClick = (num: string) => {
        if (!/^\d+$/.test(num)) return;
        setInputValue((prev) => prev + num);
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleRecommendClick = () => {
        setInputValue(String(nextRepaymentAmount));
    };

    const handleAmountAdd = (amount: number) => {
        const current = parseInt(inputValue || '0', 10);
        const updated = current + amount;
        setInputValue(String(updated));
    };

    const handleConfirm = () => {
        const parsedAmount = parseInt(inputValue || '0', 10);
        onConfirm(parsedAmount);
    };

    return (
        <div className='relative flex h-full flex-col justify-between'>
            <section className='flex flex-col gap-6'>
                <div className='flex flex-col'>
                    <span className='text-xl font-semibold'>
                        {partnerName}님께
                    </span>
                    <span className='text-line-700 font-medium'>
                        다음 상환액: {nextRepaymentAmount.toLocaleString()}원
                    </span>
                </div>

                <div className='flex flex-col gap-4'>
                    <AmountInput inputValue={inputValue} />
                    <div className='flex justify-start'>
                        <AmountDifference
                            inputValue={inputValue}
                            recommendAmount={nextRepaymentAmount}
                            onRecommendClick={handleRecommendClick}
                        />
                    </div>
                </div>
            </section>

            <div className='sticky bottom-0 left-0 mx-auto flex w-full max-w-[640px] flex-col gap-6 pb-6'>
                <AmountShortcuts onClick={handleAmountAdd} />
                <NumberPad
                    onNumberClick={handleNumberClick}
                    onDelete={handleDelete}
                />
                <AmountConfirmModal
                    inputValue={parseInt(inputValue || '0', 10)}
                    recommendAmount={repaymentAmount}
                    partnerName={partnerName}
                    earlyRepaymentFeeRate={earlyRepaymentFeeRate}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
    );
};

export default EnterAmountStep;
