import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PaymentStatus } from '@/entities/contract/model/types';
import PaymentHistoryList from '@/entities/contract/ui/PaymentList';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import ListLoading from '@/shared/ui/ListLoading';
import { useGetPaymentHistoryList } from '../../api/ContractAPI';

const statusList: PaymentStatus[] = ['전체', '납부', '연체', '중도상환'];

const PaymentHistoryTab = ({ formId }: { formId: string }) => {
    const [selected, setSelected] = useState<PaymentStatus>('전체');

    const { paymentHistoryList, lastItemRef } = useGetPaymentHistoryList({
        formId,
        status: selected,
        pageable: {
            page: '0',
            size: '10',
        },
    });

    return (
        <div className='flex flex-col gap-2'>
            <Select
                value={selected}
                onValueChange={(value: PaymentStatus) => setSelected(value)}
            >
                <div className='flex justify-end'>
                    <SelectTrigger className='w-20'>
                        <SelectValue placeholder='전체' />
                    </SelectTrigger>
                </div>

                <SelectContent>
                    {statusList.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <hr className='border-line-200' />

            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        onReset={reset}
                        FallbackComponent={ErrorFallBack}
                    >
                        <Suspense fallback={<ListLoading />}>
                            <PaymentHistoryList
                                data={paymentHistoryList}
                                lastItemRef={lastItemRef}
                            />
                        </Suspense>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </div>
    );
};

export default PaymentHistoryTab;
