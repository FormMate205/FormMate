import { Ref } from 'react';
import TransactionItem from '@/entities/transaction/ui/TransactionItem';
import { Transaction } from '../model/types';

interface TransactionListProps {
    transactions: Transaction[];
    lastItemRef?: Ref<HTMLDivElement>;
}

const TransactionList = ({
    transactions,
    lastItemRef,
}: TransactionListProps) => {
    // 날짜별로 그룹화
    const grouped = transactions.reduce(
        (acc, transaction) => {
            const date = transaction.transactionDate.substring(0, 10);
            if (!acc[date]) acc[date] = [];
            acc[date].push(transaction);
            return acc;
        },
        {} as Record<string, Transaction[]>,
    );

    const dates = Object.keys(grouped);

    return (
        <div className='flex flex-col gap-7'>
            {dates.map((date, dateIdx) => {
                const txs = grouped[date];
                return (
                    <div key={date} className='flex flex-col gap-2'>
                        <div className='text-line-700 border-line-200 border-b pb-1 font-medium'>
                            {date}
                        </div>
                        {txs.map((tx, txIdx) => {
                            const shouldAttachRef =
                                dateIdx === dates.length - 1 &&
                                txIdx === txs.length - 1;

                            return (
                                <div
                                    key={txIdx}
                                    ref={
                                        shouldAttachRef
                                            ? lastItemRef
                                            : undefined
                                    }
                                >
                                    <TransactionItem {...tx} />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionList;
