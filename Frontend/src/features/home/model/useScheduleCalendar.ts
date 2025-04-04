import { addMonths, endOfMonth, format, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { useScheduleMap } from '@/entities/home/model/useScheduleMap';

export const useScheduleCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const getViewDate = (date: Date) => format(endOfMonth(date), 'yyyy-MM-dd');

    const prevMonthDate = getViewDate(subMonths(currentMonth, 1));
    const currMonthDate = getViewDate(currentMonth);
    const nextMonthDate = getViewDate(addMonths(currentMonth, 1));

    const { data: prevData } = useScheduleMap(prevMonthDate);
    const { data: currData } = useScheduleMap(currMonthDate);
    const { data: nextData } = useScheduleMap(nextMonthDate);
    const { isLoading } = useScheduleMap(currMonthDate);

    const mergedData = useMemo(
        () => ({ ...prevData, ...currData, ...nextData }),
        [prevData, currData, nextData],
    );

    const modifiers = useMemo(() => {
        return {
            hasSettlement: (date: Date) => {
                const dayKey = String(date.getDate());
                const contracts = mergedData?.[dayKey]?.contracts ?? [];
                return contracts.some(
                    (c) =>
                        c.repaymentAmount !== null && c.repaymentAmount !== 0,
                );
            },
        };
    }, [mergedData]);

    return {
        selectedDate,
        setSelectedDate,
        currentMonth,
        setCurrentMonth,
        mergedData,
        modifiers,
        isLoading,
    };
};
