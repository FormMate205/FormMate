import { useSuspenseQuery } from '@tanstack/react-query';
import { getContractAmount } from '../api/getContractAmount';
import { ContractAmountResponse } from './types';

export const useContractAmount = () => {
    return useSuspenseQuery<ContractAmountResponse>({
        queryKey: ['contractAmount'],
        queryFn: getContractAmount,
    });
};
