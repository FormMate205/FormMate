import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { calendarCustom } from '@/features/home/model/calendarCustom';

interface ScheduleItem {
    name: string;
    amount: number;
    type: 'send' | 'receive';
    date: string; // 'yyyy-MM-dd'
}

const dummySchedules: ScheduleItem[] = [
    { name: '이동욱', amount: 80000, type: 'receive', date: '2025-04-03' },
    { name: '강지은', amount: 100000, type: 'send', date: '2025-04-03' },
    { name: '차윤영', amount: 20000, type: 'send', date: '2025-04-04' },
    { name: '윤이영', amount: 20000, type: 'send', date: '2025-05-08' },
    { name: '박상학', amount: 20000, type: 'send', date: '2025-05-08' },
];

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );

    const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

    const scheduleForSelectedDate = dummySchedules.filter(
        (s) => selectedDate && s.date === formatDateKey(selectedDate),
    );

    return (
        <section className='mb-12'>
            <div className='rounded-xl bg-white p-4 shadow-sm'>
                {/* 캘린더 컨테이너에 추가 스타일링 */}
                <div className='w-full'>
                    <Calendar
                        mode='single'
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={ko}
                        className='w-full'
                        classNames={calendarCustom}
                    />
                </div>

                {/* 정산 내역 */}
                <div className='border-line-200 mt-4 border-t-1 pt-4'>
                    {scheduleForSelectedDate.length > 0 ? (
                        scheduleForSelectedDate.map((item, idx) => (
                            <div
                                key={idx}
                                className='mb-3 flex items-center justify-between'
                            >
                                <div className='flex gap-5 p-2'>
                                    <div
                                        className={`y-10 ${
                                            item.type === 'send'
                                                ? 'bg-subPink-200'
                                                : 'bg-primary-200'
                                        } w-1`}
                                    ></div>
                                    <div className='flex-col items-center'>
                                        <p className='pb-1 font-semibold'>
                                            {item.name}
                                        </p>
                                        <p className={`text-line-400 text-sm`}>
                                            {item.type === 'send' ? '-' : '+'}{' '}
                                            {item.amount.toLocaleString()}원
                                        </p>
                                    </div>
                                </div>
                                {item.type === 'send' && (
                                    <Button variant='choiceFill'>
                                        이체하기
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='text-line-400 my-4 text-center text-sm'>
                            예정된 정산 내역이 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Schedule;
