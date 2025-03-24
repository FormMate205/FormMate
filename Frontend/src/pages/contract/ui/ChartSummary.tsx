import { useState } from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import ProgressBar from './ProgressBar';
import RadialChart from './RadialChart';

const ChartSummary = () => {
    const [selectedContractType, setSelectedContractType] = useState('all');
    return (
        <div className='border-line-200 flex flex-col gap-5 border-b py-2'>
            <div className='flex justify-between'>
                <Select
                    value={selectedContractType}
                    onValueChange={(value) => setSelectedContractType(value)}
                >
                    <SelectTrigger className='w-26'>
                        <SelectValue placeholder='전체' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>전체</SelectItem>
                        <SelectItem value='payable'>갚을 계약</SelectItem>
                        <SelectItem value='receivable'>받을 계약</SelectItem>
                    </SelectContent>
                </Select>

                <div className='flex items-center gap-0.5 font-medium'>
                    <span className='text-pink-600'>850,000</span>
                    <span>/</span>
                    <span>1,000,000</span>
                </div>
            </div>

            {/* 아래 콘텐츠는 선택값에 따라 다르게 표시 */}
            <div>
                {selectedContractType === 'all' && (
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center'>
                            <div>채무 계약</div>
                            <ProgressBar amount={0} goal={100000} />
                        </div>
                        <div className='flex items-center'>
                            <div>채권 계약</div>
                            <ProgressBar amount={100000} goal={100000} />
                        </div>
                    </div>
                )}
                {selectedContractType === 'payable' && <RadialChart />}
                {selectedContractType === 'receivable' && <div>받을 계약</div>}
            </div>
        </div>
    );
};

export default ChartSummary;
