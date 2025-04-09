import api from '@/shared/api/instance';
import { ContractItem, ScheduleMap } from '../model/types';

// export const fetchScheduleMap = async (
//     viewDate: string,
// ): Promise<ScheduleMapResponse> => {
//     const response = await api.get('/contract/schedule', {
//         params: {
//             now: new Date().toISOString().split('T')[0], // 오늘 날짜
//             viewDate, // ex: '2025-04-30' 보고 싶은 달의 말일
//         },
//     });

//     return response.data;
// };

export const fetchScheduleMap = async (viewDate: string) => {
    const res = await api.get('/contract/schedule', {
        params: { viewDate },
    });

    const result: ScheduleMap = {};

    res.data.forEach((item: ContractItem) => {
        const [, , day] = item.scheduledPaymentDate;
        const key = String(day);

        if (!result[key]) {
            result[key] = { contracts: [] };
        }

        result[key].contracts.push({
            userIsCreditor: item.userIsCreditor,
            contracteeName: item.contracteeName,
            repaymentAmount: item.repaymentAmount,
            scheduledPaymentDate: item.scheduledPaymentDate,
        });
    });

    return result;
};
