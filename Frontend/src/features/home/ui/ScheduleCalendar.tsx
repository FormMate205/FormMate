import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { ScheduleCalendarProps } from '@/entities/home/model/types';
import { calendarCustom } from '@/features/home/model/calendarCustom';

export const ScheduleCalendar = ({
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    modifiers,
}: ScheduleCalendarProps) => {
    return (
        <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => {
                if (date) setSelectedDate(date);
            }}
            locale={ko}
            className='w-full'
            classNames={calendarCustom}
            month={currentMonth}
            onMonthChange={(newMonth: Date) => {
                setCurrentMonth(newMonth);
            }}
            modifiers={modifiers}
            modifiersClassNames={{ hasSettlement: 'dot-indicator' }}
        />
    );
};
