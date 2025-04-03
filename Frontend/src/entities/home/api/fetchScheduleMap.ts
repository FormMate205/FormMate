import api from '@/shared/api/instance';
import { ScheduleMapResponse } from '../model/types';

export const fetchScheduleMap = async (
    viewDate: string,
): Promise<ScheduleMapResponse> => {
    const response = await api.get('/contract/schedule', {
        params: {
            now: new Date().toISOString().split('T')[0], // 오늘 날짜
            viewDate, // ex: '2025-04-01'
        },
    });

    return response.data;
};
