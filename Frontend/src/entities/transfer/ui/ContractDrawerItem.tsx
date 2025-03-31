import { ContractItem } from '@/features/transfer/model/types';
import { cn } from '@/lib/utils';
import { getDday } from '@/shared/lib/date';

interface Props {
    contract: ContractItem;
    onClick?: (contract: ContractItem) => void;
}

const ContractDrawerItem = ({ contract, onClick }: Props) => {
    const dDayText = getDday(contract.nextRepaymentDate);
    const isOverdue = dDayText.includes('+');

    return (
        <div
            className='border-line-200 cursor-pointer rounded-xl border px-4 py-3 text-sm'
            onClick={() => onClick?.(contract)}
        >
            <div className='flex items-center gap-6'>
                <div
                    className={cn(
                        'text-lg font-medium',
                        isOverdue ? 'text-subPink-600' : 'text-primary-500',
                    )}
                >
                    {dDayText}
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='text-base font-medium'>
                        다음 상환 금액:{' '}
                        {contract.nextRepaymentAmount.toLocaleString()}원
                    </div>
                    <div className='text-line-700 flex flex-col'>
                        <span>다음 상환일: {contract.nextRepaymentDate}</span>
                        <span>계약 기간: {contract.contractDuration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDrawerItem;
