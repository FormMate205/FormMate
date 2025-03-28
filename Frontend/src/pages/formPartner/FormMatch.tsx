import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ChangeEvent, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Input } from '@/components/ui/input';
import NewPartnerDrawer from '@/features/formPartner/ui/NewPartnerDrawer';
import RecentPartners from '@/features/formPartner/ui/RecentPartners';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import ListLoading from '@/shared/ui/ListLoading';
import { Header } from '@/widgets';

const FormMatch = () => {
    // 최근 계약 상대 기반 검색
    const [searchValue, setSearchValue] = useState('');

    const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    return (
        <>
            {' '}
            <div className='relative flex h-screen flex-col gap-8 px-4 py-2'>
                <Header title='계약 상대 등록' />

                <div className='text-xl font-semibold'>
                    누구와 계약을 원하시나요?
                </div>

                <Input
                    variant='search'
                    placeholder='이름 또는 전화번호 입력'
                    value={searchValue}
                    onChange={onInputValueChange}
                />

                <div className='flex flex-1 flex-col overflow-auto'>
                    <div className='text-lg font-medium'>
                        {searchValue ? '검색 결과' : '최근 계약 상대'}
                    </div>

                    <QueryErrorResetBoundary>
                        {({ reset }) => (
                            <ErrorBoundary
                                onReset={reset}
                                FallbackComponent={ErrorFallBack}
                            >
                                <Suspense fallback={<ListLoading />}>
                                    <RecentPartners searchValue={searchValue} />
                                </Suspense>
                            </ErrorBoundary>
                        )}
                    </QueryErrorResetBoundary>
                </div>

                <div className='sticky right-0 bottom-0 left-0 bg-white pt-2 pb-4'>
                    <NewPartnerDrawer />
                </div>
            </div>
        </>
    );
};

export default FormMatch;
