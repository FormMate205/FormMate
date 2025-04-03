import { lastDayOfMonth, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useScheduleMap } from '@/entities/home/model/useScheduleMap';
import { calendarCustom } from '@/features/home/model/calendarCustom';

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [viewDate, setViewDate] = useState<string>(
        format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
        // 1일 말고 매달 말일로 설정 필요!
    );

    const { data, isLoading } = useScheduleMap(viewDate);
    const selectedDayKey = String((selectedDate ?? new Date()).getDate());
    const scheduleForSelectedDate = (
        data?.[selectedDayKey]?.contracts ?? []
    ).filter((contract) => contract.repaymentAmount !== null);

    useEffect(() => {
        if (!selectedDate) return;

        const selectedMonth = format(selectedDate, 'yyyy-MM');
        const currentViewMonth = format(new Date(viewDate), 'yyyy-MM');

        if (selectedMonth !== currentViewMonth) {
            // 새 월의 1일로 viewDate 갱신 --> 새 월의 말일로 갱신 필요!
            setViewDate(format(lastDayOfMonth(selectedDate), 'yyyy-MM-dd'));
        }
    }, [selectedDate, viewDate]);

    return (
        <section className='mb-12'>
            <div className='rounded-xl bg-white p-4 shadow-sm'>
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
                    {isLoading ? (
                        <p className='text-center text-sm text-gray-400'>
                            불러오는 중...
                        </p>
                    ) : scheduleForSelectedDate.length > 0 ? (
                        scheduleForSelectedDate.map((item, idx) => (
                            <div
                                key={idx}
                                className='mb-3 flex items-center justify-between'
                            >
                                <div className='flex gap-5 p-2'>
                                    <div
                                        className={`y-10 ${
                                            item.userIsCreditor
                                                ? 'bg-primary-200'
                                                : 'bg-subPink-200'
                                        } w-1`}
                                    ></div>
                                    <div className='flex-col items-center'>
                                        <p className='pb-1 font-semibold'>
                                            {item.contracteeName}
                                        </p>
                                        <p className='text-line-400 text-sm'>
                                            {item.userIsCreditor ? '+' : '-'}{' '}
                                            {item.repaymentAmount.toLocaleString()}
                                            원
                                        </p>
                                    </div>
                                </div>
                                {!item.userIsCreditor && (
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
