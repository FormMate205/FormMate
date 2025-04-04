import { useQuery } from '@tanstack/react-query';
import { getContractAmount } from '../api/getContractAmount';
import { ContractAmountResponse } from './types';

export const useContractAmount = () => {
    const accessToken =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;

    return useQuery<ContractAmountResponse>({
        queryKey: ['contractAmount'],
        queryFn: getContractAmount,
        enabled: !!accessToken,
    });
};
