import { useQuery } from '@tanstack/react-query';
import { GetAccountInfoResponse } from '@/features/account/model/types';
import api from '@/shared/api/instance';

const getAccountInfo = async (): Promise<GetAccountInfoResponse> => {
    const response = await api.get<GetAccountInfoResponse>('/users/account');
    return response.data;
};

export const useGetAccountInfo = () => {
    return useQuery({
        queryKey: ['accountInfo'],
        queryFn: getAccountInfo,
    });
};
