import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Footer, Header } from '@/widgets';
import ContractCard from './ui/ContractCard';
import ContractChart from './ui/ContractChart';
import StatusSummary from './ui/StatusSummary';

// dummyData
const dummyContracts = [
    {
        name: '강지은',
        status: '진행',
        contractType: 'send',
        currentMonthAmount: 150000,
        currentAmount: 450000,
        totalAmount: 1500000,
        endDate: '2025.04.23',
    },
    {
        name: '이동욱',
        status: '대기',
    },
    {
        name: '박상학',
        status: '연체',
        contractType: 'receive',
        currentMonthAmount: 100000,
        currentAmount: 100000,
        totalAmount: 500000,
        endDate: '2025.02.15',
    },
    {
        name: '차윤영',
        status: '종료',
        contractType: 'receive',
        currentMonthAmount: 0,
        currentAmount: 1000000,
        totalAmount: 1000000,
        endDate: '2025.01.01',
    },
];

const ContractList = () => {
    return (
        <div className='flex h-full flex-col'>
            <div className='bg-line-50 flex h-full flex-col gap-4 px-4'>
                <Header title='계약 관리' />
                <div className='text-lg font-medium'>계약 현황</div>
                <StatusSummary />
                <div className='text-lg font-medium'>체결된 계약</div>
                <ContractChart />

                <section className='flex flex-col rounded-lg bg-white px-4 py-3'>
                    {/* chart section */}
                    <div className='flex flex-col gap-4'>
                        <div className='border-line-200 flex items-center justify-between border-b p-2'>
                            <div className='text-lg font-medium'>2건</div>
                            <Select>
                                <SelectTrigger className='w-24'>
                                    <SelectValue placeholder='전체' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='default'>
                                        전체
                                    </SelectItem>
                                    <SelectItem value='progress'>
                                        진행 중
                                    </SelectItem>
                                    <SelectItem value='delayed'>
                                        연체
                                    </SelectItem>
                                    <SelectItem value='end'>종료</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Input
                            variant={'search'}
                            placeholder='이름을 입력하세요'
                        />

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {dummyContracts.map((contract, index) => (
                                <ContractCard key={index} {...contract} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ContractList;
