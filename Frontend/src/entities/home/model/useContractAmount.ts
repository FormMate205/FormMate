import { useQuery } from '@tanstack/react-query';
import { getContractAmount } from '../api/getContractAmount';
import { ContractAmountResponse } from './types';

export const useContractAmount = () => {
    return useQuery<ContractAmountResponse>({
        queryKey: ['contractAmount'],
        queryFn: getContractAmount,
    });
};
