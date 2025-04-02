import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import {
    GetTransactionListRequest,
    GetTransactionListResponse,
} from '../model/types';

const getTransactionList = async (
    params: GetTransactionListRequest,
): Promise<GetTransactionListResponse> => {
    const response = await api.get('/form', { params });
    return response.data;
};

export const useGetTransactionList = (params: GetTransactionListRequest) => {
    return useQuery({
        queryKey: ['transactionList', params],
        queryFn: () => getTransactionList(params),
    });
};
