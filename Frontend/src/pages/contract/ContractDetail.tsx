import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagItem } from '@/shared';
import { Header } from '@/widgets';
import InterestInfoTab from './ui/ContractTabs/InterestInfoTab';
import PaymentHistoryTab from './ui/ContractTabs/PaymentHistoryTab';
import SummaryTab from './ui/ContractTabs/SummaryTab';
import ProgressBar from './ui/ProgressBar';

const ContractDetail = () => {
    return (
        <>
            <div className='flex h-full flex-col'>
                <div className='bg-line-50 flex h-full flex-col gap-4 px-4'>
                    <div>
                        <Header title='계약 상세' />
                        <div className='border-line-200 flex items-center justify-between border-b pb-3'>
                            <div className='text-lg font-medium'>
                                <span className='text-primary-500 text-xl'>
                                    강지은
                                </span>
                                <span>님과의 금전 차용증 계약</span>
                            </div>
                            <span className='text-purple-600'>채무 계약</span>
                        </div>
                    </div>
                    <section className='border-line-200 flex flex-col gap-6 border-b pb-4'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                                <TagItem text='연체' color='red' />
                                <div className='text-line-900 flex gap-1'>
                                    <span className='text-subPink-600 font-medium'>
                                        1회/3회
                                    </span>
                                    <span>|</span>
                                    <span>110,000원 미납</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <TagItem text='진행' />
                                <div className='text-line-900 flex gap-1'>
                                    <span className='text-primary-500 font-medium'>
                                        D-17
                                    </span>
                                    <span>|</span>
                                    <span>다음 상환 일정 - 25.03.19</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <TagItem text='중도' color='purple' />
                                <div className='text-line-900 flex gap-1'>
                                    <span className='font-medium text-purple-700'>
                                        2회
                                    </span>
                                    <span>|</span>
                                    <span>총 납부 수수료 3,568원</span>
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <ProgressBar amount={48000} goal={100000} />
                    </section>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='flex w-full justify-center gap-4'>
                            <Button variant={'choiceEmpty'}>채팅하기</Button>
                            <Button variant={'choiceFill'}>이체하기</Button>
                        </div>
                        <div className='text-line-700 underline'>
                            계약 조기 종료
                        </div>
                    </div>
                    <Tabs defaultValue='contract'>
                        <TabsList>
                            <TabsTrigger value='contract'>차용증</TabsTrigger>
                            <TabsTrigger value='history'>납부 내역</TabsTrigger>
                            <TabsTrigger value='interest'>
                                이자 조회
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='contract'>
                            <SummaryTab />
                        </TabsContent>
                        <TabsContent value='history'>
                            <PaymentHistoryTab />
                        </TabsContent>
                        <TabsContent value='interest'>
                            <InterestInfoTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default ContractDetail;
