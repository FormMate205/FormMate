import { Button } from '@/components/ui/button';
import { TagItem } from '@/shared';
import { Header } from '@/widgets';

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
                                    <span className='text-subPink-700'>
                                        1회/3회
                                    </span>
                                    <span>|</span>
                                    <span>110,000원 미납</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <TagItem text='진행' />
                                <div className='text-line-900 flex gap-1'>
                                    <span className='text-primary-500'>
                                        D-17
                                    </span>
                                    <span>|</span>
                                    <span>다음 상환 일정 - 25.03.19</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <TagItem text='중도' color='purple' />
                                <div className='text-line-900 flex gap-1'>
                                    <span className='text-purple-700'>2회</span>
                                    <span>|</span>
                                    <span>총 납부 수수료 3,568원</span>
                                </div>
                            </div>
                        </div>
                        <div>Progress Bar</div>
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
                </div>
            </div>
        </>
    );
};

export default ContractDetail;
