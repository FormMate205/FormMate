import { Input } from '@/components/ui/input';
import ContractChart from '@/entities/contract/ui/charts/ContractChart';
import { useContractFilters } from '@/features/contract/model/useContractFilters';
import ContractList from '@/features/contract/ui/ContractList';
import ContractSelect from '@/features/contract/ui/ContractSelect';
import { Footer, Header } from '@/widgets';
import ContractStatusSummary from '../../entities/contract/ui/ContractStatusSummary';

const Contracts = () => {
    const { filter, setFilter, search, onChangeSearch, filteredContracts } =
        useContractFilters();
    return (
        <div className='bg-line-50 flex h-screen flex-col overflow-hidden'>
            <div className='scrollbar-none flex h-full flex-col gap-2 overflow-y-auto px-4 py-2'>
                <Header title='계약 관리' />
                <div className='flex flex-col gap-8'>
                    {/* 계약 현황 */}
                    <ContractStatusSummary />
                    {/* 체결된 계약 */}
                    <ContractChart />

                    {/* 계약 내역 리스트 */}
                    <div className='flex flex-col gap-2'>
                        <div className='text-lg font-medium'>계약 내역</div>
                        <section className='flex flex-col gap-4 rounded-lg bg-white px-4 py-3'>
                            <div className='border-line-200 flex items-center justify-between border-b p-2'>
                                <div className='text-lg font-medium'>
                                    {filteredContracts.length}건
                                </div>
                                <ContractSelect
                                    value={filter}
                                    onChange={setFilter}
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
