import { useSuspenseQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { GetAccountInfoResponse } from '../model/types';

const getAccountInfo = async (): Promise<GetAccountInfoResponse> => {
    const response = await api.get<GetAccountInfoResponse>('/users/account');
    return response.data;
};

export const useGetAccountInfo = () => {
    return useSuspenseQuery({
        queryKey: ['accountInfo'],
        queryFn: getAccountInfo,
    });
};
