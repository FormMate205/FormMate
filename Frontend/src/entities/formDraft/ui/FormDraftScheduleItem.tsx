import { formatCurrency } from '@/shared/lib/formatCurrency';

interface FormDraftScheduleItemProps {
    idx: number;
    principal: string; // 원금
    interest: string; // 이자
    paymentAmount: string; // 납부 금액
}

const FormDraftScheduleItem = ({
    idx,
    principal,
    interest,
    paymentAmount,
}: FormDraftScheduleItemProps) => {
    return (
        <div className='grid w-full grid-cols-4 px-4 py-2 text-center border-b border-line-100 whitespace-nowrap'>
            <p>{idx + 1}회차</p>
            <p>{formatCurrency(principal)}</p>
            <p>{formatCurrency(interest)}</p>
            <p className='text-primary-500'>{formatCurrency(paymentAmount)}</p>
        </div>
    );
};

export default FormDraftScheduleItem;
