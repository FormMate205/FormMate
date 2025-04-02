import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTransactionList } from '@/features/transaction/api/TransactionAPI';
import { TransactionFilters } from '@/features/transaction/model/types';
import AccountSummary from '@/features/transaction/ui/AccountSummary';
import { Header } from '@/widgets';
import FilterDrawer from '../../features/transaction/ui/FilterDrawer';
import TransactionList from '../../features/transaction/ui/TransactionList';

const Transaction = () => {
    const navigate = useNavigate();
    const handleTransfer = () => {
        navigate('/transfer');
    };

    const [filters, setFilters] = useState<TransactionFilters>({
        period: '3개월',
        transferType: '전체',
        sortDirection: '최신순',
    });

    const { transactions, lastItemRef } = useGetTransactionList({
        ...filters,
        pageable: {
            page: '0',
            size: '10',
        },
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
                    <TransactionList
                        transactions={transactions}
                        lastItemRef={lastItemRef}
                    />
                </div>
            </section>
        </>
    );
};

export default Transaction;
