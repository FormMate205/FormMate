import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { fetchScheduleMap } from '@/entities/home/api/fetchScheduleMap';
import { ScheduleMap } from '@/entities/home/model/types';

export const useScheduleCalendar = (currentMonth: Date) => {
    const [selectedDate, setSelectedDate] = useState<ScheduleMap>({});

    useEffect(() => {
        const fetchSchedule = async () => {
            const viewDate = format(currentMonth, 'yyyy-MM-dd');
            const result = await fetchScheduleMap(viewDate);
            setSelectedDate(result);
        };

        fetchSchedule();
    }, [currentMonth]);

    return {
        selectedDate,
    };
};
