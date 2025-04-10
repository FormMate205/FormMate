import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchScheduleMap } from '@/entities/home/api/fetchScheduleMap';
import { ScheduleMap } from '@/entities/home/model/types';

export const useScheduleCalendar = (currentMonth: Date) => {
    const viewDate = format(currentMonth, 'yyyy-MM-dd');
    const { data } = useQuery<ScheduleMap>({
        queryKey: ['scheduleMap', viewDate],
        queryFn: () => fetchScheduleMap(viewDate),
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    return {
        selectedDate: data || {},
    };
};
