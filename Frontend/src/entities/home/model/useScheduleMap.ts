import { useQuery } from '@tanstack/react-query';
import { fetchScheduleMap } from '../api/fetchScheduleMap';

export const useScheduleMap = (viewDate: string) => {
    return useQuery({
        queryKey: ['scheduleMap', viewDate],
        queryFn: () => fetchScheduleMap(viewDate),
    });
};
