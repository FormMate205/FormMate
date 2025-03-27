import { Button } from '@/components/ui/button';
import DetailSummaryItem from '@/entities/contract/ui/DetailSummaryItem';
import ProgressBar from '@/entities/contract/ui/ProgressBar';
import EarlyTerminateAlert from '@/features/contract/ui/EarlyTerminateAlert';
import ContractTabs from '@/features/contract/ui/tabs/ContractTabs';
import { Header } from '@/widgets';

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
        <div className='flex h-screen flex-col'>
            <div className='bg-line-50 flex flex-col px-4 py-2'>
                <Header title='계약 상세' />
                <div className='flex h-full flex-col gap-2'>
                    <section className=''>
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
                                        <DetailSummaryItem
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
                    {/* ContractActionButtons */}
                    <div className='flex flex-col items-center gap-3 py-2'>
                        <div className='flex w-full justify-center gap-4'>
                            <Button variant={'choiceEmpty'}>채팅하기</Button>
                            <Button variant={'choiceFill'}>이체하기</Button>
                        </div>
                        <div className='text-line-700'>
                            <EarlyTerminateAlert
                                onConfirm={() => {
                                    console.log('조기 종료 신청됨!');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* ContractDetailTabs */}
            <ContractTabs />
        </div>
    );
};

export default ContractDetail;
