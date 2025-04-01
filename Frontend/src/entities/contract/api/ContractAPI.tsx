import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { GetContractStatusCountResponse } from '../model/types';

// 계약 상태별 개수 조회 (대기, 진행, 완료)
const getContractStatusCount =
    async (): Promise<GetContractStatusCountResponse> => {
        const response =
            await api.get<GetContractStatusCountResponse>('/form/count');
        return response.data;
    };

export const useGetContractStatusCount = () => {
    return useQuery({
        queryKey: ['contractStatusCount'],
        queryFn: () => getContractStatusCount(),
    });
};
