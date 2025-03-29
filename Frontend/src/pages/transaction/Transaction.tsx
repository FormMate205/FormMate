import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSummary from '@/features/transaction/ui/AccountSummary';
import { Header } from '@/widgets';
import FilterDrawer from '../../features/transaction/ui/FilterDrawer';
import TransactionList from '../../features/transaction/ui/TransactionList';

// Dummy data
const transactionsData = [
    {
        name: '강지은',
        transactionType: '출금',
        amount: '-10,000',
        date: '2025.03.12',
    },
    {
        name: '강지은',
        transactionType: '출금',
        amount: '-10,000',
        date: '2025.03.11',
    },
    {
        name: '이동욱',
        transactionType: '입금',
        amount: '+15,000',
        date: '2025.03.11',
    },
    {
        name: '이동욱',
        transactionType: '입금',
        amount: '+15,000',
        date: '2024.01.11',
    },
    {
        name: '차윤영',
        transactionType: '입금',
        amount: '+1,000',
        date: '2023.03.11',
    },
];

const Transaction = () => {
    const navigate = useNavigate();

    const handleTransfer = () => {
        navigate('/transfer');
    };
    const [filters, setFilters] = useState({
        period: '3개월',
        type: '전체',
        order: '최신순',
    });

    // 이후 API 통신으로 대체 예정 (테스트용)
    const filteredTransactions = transactionsData
        .filter((tx) => {
            if (filters.type === '전체') return true;
            return filters.type === '입금만'
                ? tx.transactionType === '입금'
                : tx.transactionType === '출금';
        })
        .sort((a, b) => {
            if (filters.order === '최신순') return b.date.localeCompare(a.date);
            return a.date.localeCompare(b.date);
        });

    return (
        <>
            <section className='bg-primary-50 flex flex-col gap-4 px-4 py-2 pb-9'>
                <Header title='거래내역 조회' />
                <AccountSummary
                    accountInfo={{
                        bankName: '싸피은행',
                        accountNumber: '111-1111-1111',
                        balance: '12,345',
                    }}
                    onTransfer={handleTransfer}
                />
            </section>
            <section className='flex flex-col gap-4 p-4'>
                <FilterDrawer
                    defaultValues={filters}
                    onConfirm={(nextFilters) => setFilters(nextFilters)}
                />
                <div className='flex flex-col gap-6'>
                    <TransactionList transactions={filteredTransactions} />
                </div>
            </section>
        </>
    );
};

export default Transaction;
