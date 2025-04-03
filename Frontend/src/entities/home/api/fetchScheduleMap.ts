import api from '@/shared/api/instance';
import { ScheduleMapResponse } from '../model/types';

export const fetchScheduleMap = async (
    viewDate: string,
): Promise<ScheduleMapResponse> => {
    const response = await api.get('/contract/schedule', {
        params: {
            now: new Date().toISOString().split('T')[0], // 오늘 날짜
            viewDate, // ex: '2025-04-30' 보고 싶은 달의 말일
        },
    });

    return response.data;
};
