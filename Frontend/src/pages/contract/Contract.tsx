import { Input } from '@/components/ui/input';
import { ContractStatus } from '@/entities/contract/types';
import { useContractFilters } from '@/features/contract/model/useContractFilters';
import ContractChart from '@/features/contract/ui/charts/ContractChart';
import ContractList from '@/features/contract/ui/ContractList';
import ContractSelect from '@/features/contract/ui/ContractSelect';
import { Footer, Header } from '@/widgets';
import StatusSummary from '../../features/contract/ui/StatusSummary';

export interface ContractCardProps {
    name: string;
    status: ContractStatus;
    contractType?: 'send' | 'receive';
    endDate?: string;
    progress?: number;
    currentAmount?: number;
    currentMonthAmount?: number;
    totalAmount?: number;
}

const Contract = () => {
    const {
        filter,
        setFilter,
        filteredContracts, // 상태 + 필터된 결과
    } = useContractFilters();
    return (
        <div className='bg-line-50 flex h-screen flex-col overflow-hidden'>
            <div className='scrollbar-none flex h-full flex-col gap-2 overflow-y-auto px-4 py-2'>
                <Header title='계약 관리' />
                <div className='flex flex-col gap-4'>
                    {/* 계약 현황 */}
                    <StatusSummary />
                    {/* 체결된 계약 */}
                    <ContractChart />
                    {/* 계약 내역 */}
                    <div className='flex flex-col gap-2'>
                        <div className='text-lg font-medium'>계약 내역</div>
                        <section className='flex flex-col gap-4 rounded-lg bg-white px-4 py-3'>
                            <div className='border-line-200 flex items-center justify-between border-b p-2'>
                                <div className='text-lg font-medium'>2건</div>
                                <ContractSelect
                                    value={filter}
                                    onChange={setFilter}
                                />
                            </div>
                            <Input
                                variant={'search'}
                                placeholder='이름을 입력하세요'
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

export default Contract;
