import { formatCurrency } from '@/shared/lib/formatCurrency';

interface Props {
    inputValue: string;
    placeholder?: string;
    recommendAmount?: number;
    onRecommendClick?: () => void;
}

const AmountInput = ({
    inputValue,
    placeholder = '얼마를 보낼까요?',
}: Props) => {
    return (
        <div className='flex flex-col gap-4'>
            <input
                type='text'
                readOnly
                value={formatCurrency(inputValue)}
                placeholder={placeholder}
                className='border-line-300 placeholder:text-line-300 w-full border-b-2 py-3 text-2xl font-semibold outline-none'
            />
        </div>
    );
};

export default AmountInput;
