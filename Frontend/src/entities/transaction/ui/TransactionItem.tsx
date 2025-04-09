import { Transaction } from '@/features/transaction/model/types';
import { formatCurrency } from '@/shared/lib/formatCurrency';

type TransactionItemProps = Omit<Transaction, 'transactionDate'>;

const TransactionItem = ({
    partnerName,
    type,
    amount,
}: TransactionItemProps) => {
    const sign = type === '출금' ? '-' : '+';
    const signColor = type === '출금' ? 'text-subPink-600' : 'text-primary-500';

    return (
        <div className='border-line-100 flex justify-between border-b pb-2'>
            <div className='flex items-center text-lg font-medium'>
                {partnerName}
            </div>
            <div className='flex flex-col items-end'>
                <span className='text-line-700 font-medium'>{type}</span>
                <span className={`${signColor} font-semibold`}>
                    {sign}
                    {formatCurrency(amount)}
                </span>
            </div>
        </div>
    );
};

export default TransactionItem;
