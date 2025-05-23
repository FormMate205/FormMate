import { Button } from '@/components/ui/button';
import useTransferStore from '../../model/TransferStore';

interface AmountDifferenceProps {
    inputValue: string;
    recommendAmount: number;
    onRecommendClick: () => void;
}

const AmountDifference = ({
    inputValue,
    recommendAmount,
    onRecommendClick,
}: AmountDifferenceProps) => {
    const currentAmount = parseInt(inputValue || '0', 10);
    const difference = currentAmount - recommendAmount;
    const { earlyRepaymentFeeRate } = useTransferStore();

    if (!inputValue) {
        return (
            <Button variant='choiceEmpty' onClick={onRecommendClick}>
                상환액 {recommendAmount.toLocaleString()}원
            </Button>
        );
    }

    if (difference === 0) {
        return (
            <span className='text-primary-500 text-base font-medium'>
                정확한 상환액입니다
            </span>
        );
    }

    return (
        <div className='flex flex-col gap-1 font-medium text-gray-700'>
            <div className='flex items-center gap-2'>
                <div className='border-line-500 rounded-xl border px-3 py-1'>
                    차액
                </div>
                <div className='text-lg font-medium'>
                    {difference > 0 ? (
                        <span className='text-primary-500'>
                            + {Math.abs(difference).toLocaleString()}원
                        </span>
                    ) : (
                        <span className='text-subPink-600'>
                            - {Math.abs(difference).toLocaleString()}원
                        </span>
                    )}
                </div>
            </div>

            <div className='text-line-900 mt-1 min-h-[20px] text-sm'>
                {difference > 0 && earlyRepaymentFeeRate > 0 ? (
                    <p>
                        조기 상환 수수료 {earlyRepaymentFeeRate}%가 부과될 수
                        있어요.
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default AmountDifference;
