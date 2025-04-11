import { Input } from '@/components/ui/input';
import ContractChart from '@/entities/contract/ui/charts/ContractChart';
import ContractStatusSummary from '@/entities/contract/ui/ContractStatusSummary';
import { useContractFilters } from '@/features/contract/model/useContractFilters';
import ContractList from '@/features/contract/ui/ContractList';
import ContractSelect from '@/features/contract/ui/ContractSelect';
import { Footer, Header } from '@/widgets';

const Contracts = () => {
    const {
        search,
        onChangeSearch,
        filterLabel,
        setFilterLabel,
        filteredContracts,
        isLoading,
        isError,
    } = useContractFilters();

    return (
        <div className='bg-line-50 flex min-h-screen flex-col pb-[80px]'>
            <div className='flex flex-1 flex-col gap-2 px-4 py-2'>
                <Header title='계약 관리' />
                <div className='flex flex-1 flex-col gap-8'>
                    <ContractStatusSummary />
                    <ContractChart />

                    <div className='flex flex-1 flex-col gap-2'>
                        <div className='text-lg font-medium'>계약 내역</div>
                        <section className='flex flex-1 flex-col gap-4 rounded-lg bg-white px-4 py-3'>
                            <div className='border-line-200 flex items-center justify-between border-b p-2'>
                                <div className='text-lg font-medium'>
                                    {isLoading
                                        ? '로딩 중...'
                                        : isError
                                          ? '불러오기 실패'
                                          : `${filteredContracts.length}건`}
                                </div>
                                <ContractSelect
                                    value={filterLabel}
                                    onChange={setFilterLabel}
                                />
                            </div>
                            <Input
                                variant={'search'}
                                placeholder='이름을 입력하세요'
                                value={search}
                                onChange={onChangeSearch}
                            />
                            <ContractList contracts={filteredContracts} />
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contracts;
