import { useScheduleCalendar } from '../model/useScheduleCalendar';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleList } from './ScheduleList';

const Schedule = () => {
    const {
        selectedDate,
        setSelectedDate,
        currentMonth,
        setCurrentMonth,
        mergedData,
        modifiers,
        isLoading,
    } = useScheduleCalendar();

    const selectedDayKey = String((selectedDate ?? new Date()).getDate());
    const contracts =
        mergedData?.[selectedDayKey]?.contracts?.filter(
            (c) => c.repaymentAmount !== null && c.repaymentAmount !== 0,
        ) ?? [];

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
