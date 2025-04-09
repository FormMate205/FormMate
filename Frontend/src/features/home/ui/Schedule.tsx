import { useState } from 'react';
import { useScheduleCalendar } from '../model/useScheduleCalendar';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleList } from './ScheduleList';

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const { selectedDate: scheduleData } = useScheduleCalendar(currentMonth);

    // 캘린더 표시(dot)를 위한 modifiers 생성
    const modifiers = {
        hasSettlement: Object.keys(scheduleData).map((day) => {
            const date = new Date(currentMonth);
            date.setDate(parseInt(day));
            return date;
        }),
    };

    const selectedDayKey = String(selectedDate.getDate());
    const contracts =
        scheduleData[selectedDayKey]?.contracts?.filter(
            (c) => c.repaymentAmount !== null && c.repaymentAmount !== 0,
        ) ?? [];

    const isLoading = false; // useScheduleCalendar에 로딩 상태를 추가할 수 있습니다

    return (
        <section className='mb-12'>
            <div className='rounded-xl bg-white p-4 shadow-sm'>
                <div className='w-full'>
                    <ScheduleCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        modifiers={modifiers}
                    />
                </div>

                <div className='border-line-200 mt-4 border-t-1 pt-4'>
                    {isLoading ? (
                        <p className='text-center text-sm text-gray-400'>
                            불러오는 중...
                        </p>
                    ) : (
                        <ScheduleList contracts={contracts} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Schedule;
