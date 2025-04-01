import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import {
    GetContractAmountChart,
    GetContractDetail,
    GetContractStatusCountResponse,
} from '../model/types';

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
        queryFn: getContractStatusCount,
    });
};

// 보낼 금액, 받은 금액 차트
const getContractAmountChart = async (): Promise<GetContractAmountChart> => {
    const response = await api.get<GetContractAmountChart>('/contract/amount');
    return response.data;
};

export const useGetContractAmountChart = () => {
    return useQuery({
        queryKey: ['contractAmountChart'],
        queryFn: getContractAmountChart,
    });
};

// 차용증 상세 조회
const getContractDetail = async (
    formId: string,
): Promise<GetContractDetail> => {
    const response = await api.get<GetContractDetail>(`/form/${formId}`);
    return response.data;
};

export const useGetContractDetail = (formId: string) => {
    return useQuery({
        queryKey: ['contractDetail', formId],
        queryFn: () => getContractDetail(formId),
    });
};
