import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

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
                        classNames={{
                            months: 'w-full flex flex-col space-y-4',
                            month: 'w-full space-y-8 ',
                            caption:
                                'flex justify-between pt-2 relative items-center w-full',
                            caption_label:
                                'text-sm font-bold absolute left-1/2 transform -translate-x-1/2',
                            nav: 'w-full flex items-center justify-between',
                            nav_button:
                                'bg-transparent p-0 opacity-50 hover:opacity-100',
                            table: 'w-full border-collapse space-y-1',
                            head_row: 'flex w-full',
                            head_cell:
                                'text-muted-foreground rounded-md w-full font-light text-xs text-[0.8rem]',
                            row: 'flex w-full mt-2',
                            cell: 'h-9 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                            day: 'h-9 w-full p-0 font-normal aria-selected:opacity-100',
                            day_selected:
                                'bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
                            day_today:
                                'border rounded-full border-blue-300 text-blue-600',
                            day_outside: 'text-muted-foreground opacity-50',
                            day_disabled: 'text-muted-foreground opacity-50',
                            day_range_middle:
                                'aria-selected:bg-accent aria-selected:text-accent-foreground',
                            day_hidden: 'invisible',
                        }}
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
