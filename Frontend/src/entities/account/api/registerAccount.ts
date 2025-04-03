import api from '@/shared/api/instance';
import { RegisterAccountPayload } from '../model/types';

export const registerAccount = async (payload: RegisterAccountPayload) => {
    const response = await api.put('/users/account/register', payload);
    return response.data;
};
