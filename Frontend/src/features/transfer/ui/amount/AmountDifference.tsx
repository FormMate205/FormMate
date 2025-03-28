import { Button } from '@/components/ui/button';

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

    if (!inputValue) {
        return (
            <Button variant='choiceEmpty' onClick={onRecommendClick}>
                상환액 {recommendAmount.toLocaleString()}원
            </Button>
        );
    }

    if (difference === 0) {
        return (
            <span className='text-base font-medium text-gray-700'>
                정확한 상환액입니다
            </span>
        );
    }

    return (
        <div className='flex items-center gap-2 font-medium text-gray-700'>
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
    );
};

export default AmountDifference;
