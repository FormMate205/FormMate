import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/shared';
import { Header } from '@/widgets';

import InterestInfoTab from './ui/ContractTabs/InterestInfoTab';
import PaymentHistoryTab from './ui/ContractTabs/PaymentHistoryTab';
import SummaryTab from './ui/ContractTabs/SummaryTab';
import ProgressBar from './ui/ProgressBar';
import SummaryItem from './ui/SummaryItem';

const summaryData = [
    {
        tag: '연체',
        color: 'red',
        mainText: '1회/3회',
        subText: '110,000원 미납',
        withIcon: true,
    },
    {
        tag: '진행',
        mainText: 'D-17',
        subText: '다음 상환 일정 25.03.19',
    },
    {
        tag: '중도',
        color: 'purple',
        mainText: '2회',
        subText: '총 납부 수수료 3,568원',
    },
];

const ContractDetail = () => {
    return (
        <>
            <div className='flex h-full flex-col'>
                <div className='bg-line-50 flex h-full flex-col gap-5'>
                    <section className='px-4'>
                        <Header title='계약 상세' />
                        <div className='border-line-200 flex items-center justify-between border-b pb-3'>
                            <div className='text-lg font-medium'>
                                <span className='text-primary-500 text-xl'>
                                    강지은
                                </span>
                                <span>님과의 차용증 계약</span>
                            </div>
                            <span className='text-purple-600'>채무 계약</span>
                        </div>
                        <div className='border-line-200 flex flex-col gap-8 border-b py-4'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                    {summaryData.map((item, idx) => (
                                        <SummaryItem
                                            key={idx}
                                            tagText={item.tag}
                                            color={item.color}
                                            mainText={item.mainText}
                                            subText={item.subText}
                                            withIcon={item.withIcon}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <ProgressBar amount={48000} goal={100000} />
                        </div>
                    </section>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='flex w-full justify-center gap-4'>
                            <Button variant={'choiceEmpty'}>채팅하기</Button>
                            <Button variant={'choiceFill'}>이체하기</Button>
                        </div>
                        <div className='text-line-700 underline'>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div className='border-b'>
                                        계약 조기 종료
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <div className='flex justify-center'>
                                            <Icons
                                                name='exclamation'
                                                size={28}
                                                className='fill-primary-500'
                                            />
                                        </div>
                                        <AlertDialogDescription>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col'>
                                                    <div>
                                                        조기 종료는
                                                        <span className='text-primary-500'>
                                                            상호 동의 하에만
                                                        </span>
                                                        이루어집니다.
                                                    </div>
                                                    <div>
                                                        조기종료 시,
                                                        <span className='text-primary-500'>
                                                            미납 금액 52,000원
                                                        </span>
                                                        은 상환 의무가
                                                        사라집니다.
                                                    </div>
                                                </div>
                                                <div className='font-medium text-black'>
                                                    상대에게 조기 종료를
                                                    신청하시겠습니까?
                                                </div>
                                            </div>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            아니오
                                        </AlertDialogCancel>
                                        <AlertDialogAction>
                                            예
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <section className='bg-white'>
                        <Tabs defaultValue='contract'>
                            <TabsList>
                                <TabsTrigger value='contract'>
                                    차용증
                                </TabsTrigger>
                                <TabsTrigger value='history'>
                                    납부 내역
                                </TabsTrigger>
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
                    </section>
                </div>
            </div>
        </>
    );
};

export default ContractDetail;
