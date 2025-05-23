import { useState, useMemo } from 'react';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
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
    const { data: accountInfo } = useGetAccountInfo();
    const nextRepaymentAmount = scheduledInfo?.monthlyRemainingPayment ?? 0;
    const earlyRepaymentFeeRate = scheduledInfo?.earlyRepaymentFeeRate ?? 0;

    const parsedAmount = useMemo(() => {
        const value = parseInt(inputValue || '0', 10);
        return value === 0 ? 0 : value;
    }, [inputValue]);

    const isOverBalance = useMemo(
        () => parsedAmount > (accountInfo?.accountBalance ?? 0),
        [parsedAmount, accountInfo?.accountBalance],
    );

    // 넘버패드 클릭
    const handleNumberClick = (num: string) => {
        if (!/^\d+$/.test(num)) return;
        // 첫 번째 입력이 0인 경우 무시
        if (inputValue === '' && num === '0') return;
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
        if (isOverBalance) return;
        onConfirm(parsedAmount);
    };

    return (
        <div className='relative mx-auto flex h-full w-full max-w-[390px] flex-col justify-between'>
            <section className='flex flex-col'>
                <div className='flex flex-col'>
                    <span className='text-xl font-semibold'>
                        {partnerName}님께
                    </span>
                    <span className='font-medium text-line-700'>
                        다음 상환액: {nextRepaymentAmount.toLocaleString()}원
                    </span>
                </div>
                <div className='min-h-[24px]'>
                    {isOverBalance && (
                        <span className='text-sm text-red-500'>
                            계좌 잔액이 부족합니다. 다른 금액을 입력해주세요.
                        </span>
                    )}
                </div>

                <div className='flex flex-col gap-3'>
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

            <div className='sticky bottom-0 left-0 flex flex-col w-full gap-4 pb-4'>
                <AmountShortcuts onClick={handleAmountAdd} />
                <NumberPad
                    onNumberClick={handleNumberClick}
                    onDelete={handleDelete}
                />
                <AmountConfirmModal
                    inputValue={parsedAmount}
                    recommendAmount={repaymentAmount}
                    partnerName={partnerName}
                    earlyRepaymentFeeRate={earlyRepaymentFeeRate}
                    onConfirm={handleConfirm}
                    disabled={isOverBalance}
                />
            </div>
        </div>
    );
};

export default EnterAmountStep;
