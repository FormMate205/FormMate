import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ArrowListItem from '@/shared/ui/ArrowListItem';
import { Footer, Header } from '@/widgets';
import { TagItem } from '../../shared';
import RadialChart from './ui/RadialChart';

const ContractList = () => {
    return (
        <div className='flex h-full flex-col'>
            <div className='bg-line-50 flex h-full flex-col gap-4 px-4'>
                <Header title='계약 관리' />
                <section className='flex rounded-lg bg-white py-3'>
                    <div className='flex w-full text-center'>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r text-center'>
                            <span>진행</span>
                            <span className='text-center font-medium'>3</span>
                        </div>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r'>
                            <span>갚을</span>
                            <span className='text-primary-500 text-center font-medium'>
                                2
                            </span>
                        </div>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r'>
                            <span>받을</span>
                            <span className='text-primary-500 text-center font-medium'>
                                1
                            </span>
                        </div>
                        <div className='flex flex-1 flex-col gap-2'>
                            <span>종료</span>
                            <span className='text-line-300 text-center font-medium'>
                                10
                            </span>
                        </div>
                    </div>
                </section>
                <section className='flex flex-col rounded-lg bg-white px-4 py-3'>
                    <div className='border-line-200 flex flex-col gap-10 border-b py-2'>
                        <div className='flex justify-between'>
                            <Select>
                                <SelectTrigger className='w-26'>
                                    <SelectValue placeholder='전체' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>전체</SelectItem>
                                    <SelectItem value='payable'>
                                        갚을 계약
                                    </SelectItem>
                                    <SelectItem value='receivable'>
                                        받을 계약
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div className='flex items-center gap-0.5 font-medium'>
                                <span className='text-pink-600'>850,000</span>
                                <span>/</span>
                                <span>1,000,000</span>
                            </div>
                        </div>
                        {/* 계약 상태 표시  */}
                        <div>
                            <RadialChart />
                        </div>
                    </div>
                    <div>
                        <div className='border-line-200 flex items-center justify-between border-b p-2'>
                            <div className='text-lg font-medium'>2건</div>
                            <Select>
                                <SelectTrigger className='w-24'>
                                    <SelectValue placeholder='전체' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>전체</SelectItem>
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
                        <div className='p-4'>검색바</div>
                        <div className='flex'>
                            <TagItem text='진행' />
                            <ArrowListItem
                                title='강지은'
                                subString='금전 차용증 계약'
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ContractList;
