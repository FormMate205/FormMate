import { useQuery } from '@tanstack/react-query';
import { getContractAmount } from '../api/getContractAmount';

export const useContractAmount = () => {
    return useQuery({
        queryKey: ['contractAmount'],
        queryFn: getContractAmount,
    });
};
