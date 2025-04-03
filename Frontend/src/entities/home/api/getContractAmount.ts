import api from '@/shared/api/instance';
import { ContractAmountResponse } from '../model/types';

export const getContractAmount = async (): Promise<ContractAmountResponse> => {
    const response = await api.get('/contract/amount');
    return response.data;
};
