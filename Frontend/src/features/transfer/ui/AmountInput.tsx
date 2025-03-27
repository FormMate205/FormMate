import { Button } from '@/components/ui/button';

interface Props {
    inputValue: string;
    placeholder?: string;
    recommendAmount?: number;
    onRecommendClick?: () => void;
}

const AmountInput = ({
    inputValue,
    placeholder = '얼마를 보낼까요?',
    recommendAmount = 0,
    onRecommendClick,
}: Props) => {
    return (
        <div className='flex flex-col gap-4'>
            <input
                type='text'
                readOnly
                value={inputValue}
                placeholder={placeholder}
                className='border-line-300 placeholder:text-line-300 w-full border-b-2 py-3 text-2xl font-semibold outline-none'
            />
            <div className='flex justify-center'>
                <Button variant='choiceEmpty' onClick={onRecommendClick}>
                    상환액 {recommendAmount}원
                </Button>
            </div>
        </div>
    );
};

export default AmountInput;
