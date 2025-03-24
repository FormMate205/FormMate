import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
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
                        <SelectItem value='payable'>채무 계약</SelectItem>
                        <SelectItem value='receivable'>채권 계약</SelectItem>
                    </SelectContent>
                </Select>

                <div className='flex items-center gap-0.5 font-medium'>
                    <span className='text-pink-600'>850,000</span>
                    <span>/</span>
                    <span>1,000,000</span>
                </div>
            </div>

            {/* select value에 따른 차트 변화*/}
            <div>
                {selectedContractType === 'all' && (
                    <div className='text-line-900 flex flex-col gap-4 px-4 py-6'>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-4'>
                                <div className='font-medium whitespace-nowrap'>
                                    채무계약
                                </div>
                                <Progress value={48} />
                            </div>
                            <div className='text-line-700 flex justify-end'>
                                100,000원
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-4'>
                                <div className='font-medium whitespace-nowrap'>
                                    채권계약
                                </div>
                                <Progress value={79} color='blue' />
                            </div>
                            <div className='text-line-700 flex justify-end'>
                                100,000원
                            </div>
                        </div>
                    </div>
                )}
                {selectedContractType === 'payable' && <RadialChart />}
                {selectedContractType === 'receivable' && (
                    <RadialChart color='blue' />
                )}
            </div>
        </div>
    );
};

export default ChartSummary;
