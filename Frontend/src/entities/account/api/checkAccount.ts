import api from '@/shared/api/instance';
import { CheckAccountPayload } from '../model/types';

export const checkAccount = async (payload: CheckAccountPayload) => {
    const res = await api.post('/users/account', payload);
    return res.data; // "존재하는 계좌입니다."
};
