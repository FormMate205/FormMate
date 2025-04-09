import api from '@/shared/api/instance';
import { ContractItem, ScheduleMap } from '../model/types';

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
