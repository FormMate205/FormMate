import api from '@/shared/api/instance';
import { AccountVerifyValues } from '../model/types';

export const verifyAccount = async (formData: AccountVerifyValues) => {
    const response = await api.put('/users/account/register', formData);
    return response.data;
};
