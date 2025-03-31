import { TagItem } from '@/shared';
import { TagColor } from '@/shared/model/types';

const tagColorMap: Record<string, TagColor> = {
    중도: 'subPurple',
    납부: 'primary',
    연체: 'subPink',
    이자: 'line',
};

interface PaymentItemProps {
    date: string;
    round: string;
    amount: string;
    tagText: string;
    description: string;
}

const PaymentItem = ({
    date,
    round,
    amount,
    tagText,
    description,
}: PaymentItemProps) => {
    return (
        <div className='border-line-200 flex justify-between gap-4 border-b py-3'>
            <div className='text-line-900'>{date}</div>
            <div className='flex flex-1 flex-col gap-0.5'>
                <div className='flex flex-1 justify-between text-lg'>
                    <span>{round}</span>
                    <span className='font-medium'>{amount}</span>
                </div>
                <div className='flex flex-1 items-center justify-between'>
                    <TagItem text={tagText} color={tagColorMap[tagText]} />
                    <span className='text-line-900'>{description}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentItem;
