import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Calendar from './Calendar';

export default function Schedule() {
    const hasSchedule = true;
    const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');

    return (
        <div className='mb-20'>
            <p className='mb-4 text-lg font-semibold'>일정</p>
            <div className='rounded-lg bg-white p-4 pt-8 shadow-sm'>
                <Calendar />

                {/* 보낼/받을 금액 토글 */}
                <div className='bg-line-100 mb-4 flex overflow-hidden rounded-xl p-1 text-sm'>
                    <div
                        className={`flex-1 cursor-pointer rounded-lg py-2 text-center ${activeTab === 'send' ? 'bg-white font-semibold' : 'text-line-500'}`}
                        onClick={() => setActiveTab('send')}
                    >
                        보낼 금액
                    </div>
                    <div
                        className={`flex-1 cursor-pointer rounded-lg py-2 text-center ${activeTab === 'receive' ? 'bg-white font-semibold' : 'text-line-500'}`}
                        onClick={() => setActiveTab('receive')}
                    >
                        받을 금액
                    </div>
                </div>

                {/* 일정 or 일정 없음 */}
                {hasSchedule ? (
                    <>
                        <div className='flex items-center justify-between p-2 text-sm'>
                            <span className='text-primary-500 mr-2'>D-3</span>{' '}
                            이동욱 - 80,000원
                            <Button variant={'choiceFill'}>이체하기</Button>
                        </div>
                        <div className='flex items-center justify-between p-2 text-sm'>
                            <span className='text-subPink-700 mr-2'>D+2</span>{' '}
                            이동욱 - 100,000원
                            <Button variant={'choiceFill'}>이체하기</Button>
                        </div>
                    </>
                ) : (
                    <p className='text-line-400 my-6 text-center text-sm'>
                        예정된 상환 일정이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
}
