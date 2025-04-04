import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import {
    ContractAmountChart,
    GetContractDetailOverviewResponse,
    GetContractDetailResponse,
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
const getContractAmountChart = async (): Promise<ContractAmountChart> => {
    const response = await api.get<ContractAmountChart>('/contract/amount');
    return response.data;
};

export const useGetContractAmountChart = () => {
    const accessToken =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;

    return useQuery({
        queryKey: ['contractAmountChart'],
        queryFn: getContractAmountChart,
        enabled: !!accessToken,
    });
};

// 차용증 상세 조회
const getContractDetail = async (
    formId: string,
): Promise<GetContractDetailResponse> => {
    const response = await api.get<GetContractDetailResponse>(
        `/form/${formId}`,
    );
    return response.data;
};

export const useGetContractDetail = (formId: string) => {
    return useQuery({
        queryKey: ['contractDetail', formId],
        queryFn: () => getContractDetail(formId),
    });
};

// 계약 상세 조회 (Detail 상단 내용)
const getContractDetailOverview = async (
    formId: string,
): Promise<GetContractDetailOverviewResponse> => {
    const response = await api.get<GetContractDetailOverviewResponse>(
        `contract/${formId}`,
    );
    return response.data;
};

export const useGetContractDetailOverview = (formId: string) => {
    return useQuery({
        queryKey: ['contractDetailOverview', formId],
        queryFn: () => getContractDetailOverview(formId),
    });
};
