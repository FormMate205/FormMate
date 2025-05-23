import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useGetAccountInfo } from '@/entities/account/api/AccountAPI';
import { useGetTransactionList } from '@/features/transaction/api/TransactionAPI';
import { TransactionFilters } from '@/features/transaction/model/types';
import AccountSummary from '@/features/transaction/ui/AccountSummary';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import ListLoading from '@/shared/ui/ListLoading';
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

    const { data: account } = useGetAccountInfo();

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
                {account && (
                    <AccountSummary
                        accountInfo={account}
                        onTransfer={handleTransfer}
                    />
                )}
            </section>
            <section className='flex flex-col gap-4 p-4'>
                <FilterDrawer
                    defaultValues={filters}
                    onConfirm={(nextFilters) => setFilters(nextFilters)}
                />
                <div className='flex flex-col gap-6'>
                    <QueryErrorResetBoundary>
                        {({ reset }) => (
                            <ErrorBoundary
                                onReset={reset}
                                FallbackComponent={ErrorFallBack}
                            >
                                <Suspense fallback={<ListLoading />}>
                                    {transactions.length === 0 ? (
                                        <p className='text-line-700 mt-16 text-center'>
                                            선택하신 조건에 해당하는 거래 내역이
                                            없습니다.
                                        </p>
                                    ) : (
                                        <TransactionList
                                            transactions={transactions}
                                            lastItemRef={lastItemRef}
                                        />
                                    )}
                                </Suspense>
                            </ErrorBoundary>
                        )}
                    </QueryErrorResetBoundary>
                </div>
            </section>
        </>
    );
};

export default Transaction;
