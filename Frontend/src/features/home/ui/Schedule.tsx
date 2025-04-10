import { useState } from 'react';
import { useScheduleCalendar } from '../model/useScheduleCalendar';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleList } from './ScheduleList';

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const { selectedDate: scheduleData } = useScheduleCalendar(currentMonth);

    const hasSettlementDates: Date[] = [];

    Object.values(scheduleData).forEach(({ contracts }) => {
        contracts.forEach((contract) => {
            const [year, month, day] = contract.scheduledPaymentDate;
            hasSettlementDates.push(new Date(year, month - 1, day));
        });
    });

    const modifiers = {
        hasSettlement: hasSettlementDates,
    };

    const contracts = Object.values(scheduleData)
        .flatMap(({ contracts }) => contracts)
        .filter((contract) => {
            const [y, m, d] = contract.scheduledPaymentDate;
            return (
                selectedDate.getFullYear() === y &&
                selectedDate.getMonth() === m - 1 &&
                selectedDate.getDate() === d
            );
        });

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
                    <ScheduleList contracts={contracts} />
                </div>
            </div>
        </section>
    );
};

export default Schedule;
