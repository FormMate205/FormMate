import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { ContractStatus, GetContractsResponse } from '../model/types';

// 계약 리스트 조회
const getContracts = async (
    status: ContractStatus[],
): Promise<GetContractsResponse> => {
    const response = await api.get<GetContractsResponse>('/api/contract', {
        params: { status },
    });
    return response.data;
};

export const useGetContractList = (status: ContractStatus[]) => {
    return useQuery({
        queryKey: ['contractList', ...status],
        queryFn: () => getContracts(status),
    });
};
