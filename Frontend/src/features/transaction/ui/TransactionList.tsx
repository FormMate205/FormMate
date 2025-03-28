import TransactionItem from '@/entities/transaction/ui/TransactionItem';

interface TransactionListProps {
    transactions: Transaction[];
}

interface Transaction {
    name: string;
    transactionType: string;
    amount: string;
    date: string;
}

const TransactionList = ({ transactions }: TransactionListProps) => {
    // 날짜별로 그룹화
    const groupedTransactions = transactions.reduce(
        (acc, transaction) => {
            if (!acc[transaction.date]) acc[transaction.date] = [];
            acc[transaction.date].push(transaction);
            return acc;
        },
        {} as Record<string, Transaction[]>,
    );

    return (
        <div className='flex flex-col gap-7'>
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
                <div key={date} className='flex flex-col gap-2'>
                    {/* 날짜*/}
                    <div className='text-line-700 border-line-200 border-b pb-1 font-medium'>
                        {date}
                    </div>
                    {/* 개별 거래 내역 */}
                    {transactions.map((transaction, index) => (
                        <TransactionItem key={index} {...transaction} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TransactionList;
