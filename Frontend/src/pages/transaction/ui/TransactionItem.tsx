interface TransactionItemProps {
    name: string;
    transactionType: string; // '출금 | 입금'
    amount: string;
}

const TransactionItem = ({
    name,
    transactionType,
    amount,
}: TransactionItemProps) => {
    return (
        <div className='border-line-100 flex justify-between border-b pb-2'>
            <div className='flex items-center text-lg font-medium'>{name}</div>
            <div className='flex flex-col items-end'>
                <span className='text-line-700 font-medium'>
                    {transactionType}
                </span>
                <span className='text-primary-500 font-semibold'>{amount}</span>
            </div>
        </div>
    );
};

export default TransactionItem;
