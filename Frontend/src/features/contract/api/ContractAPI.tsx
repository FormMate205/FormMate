import { useQuery } from '@tanstack/react-query';
import { ContractStatus } from '@/entities/contract/model/types';
import api from '@/shared/api/instance';
import {
    GetContractListResponse,
    GetPaymentSummaryResponse,
} from '../model/types';

// 계약 리스트 조회 및 상태별 필터링
const getContractList = async (
    status: ContractStatus[],
): Promise<GetContractListResponse> => {
    const searchParams = new URLSearchParams();
    status.forEach((s) => searchParams.append('status', s));
    const response = await api.get<GetContractListResponse>(
        `/contract?${searchParams.toString()}`,
    );
    return response.data;
};

export const useGetContractList = (status: ContractStatus[]) => {
    return useQuery({
        queryKey: ['contractList', status],
        queryFn: () => getContractList(status),
    });
};

// 납부 요약 조회
const getPaymentSummary = async (
    formId: string,
): Promise<GetPaymentSummaryResponse> => {
    const response = await api.get<GetPaymentSummaryResponse>(
        `/contract/${formId}/interest`,
    );
    return response.data;
};

export const useGetPaymentSummary = (formId: string) => {
    return useQuery({
        queryKey: ['paymentSummary', formId],
        queryFn: () => getPaymentSummary(formId),
    });
};
