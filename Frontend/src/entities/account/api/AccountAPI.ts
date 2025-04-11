import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/shared/api/instance';
import { ErrorResponse } from '@/widgets/modal/types';
import { GetAccountInfoResponse } from '../model/types';

const getAccountInfo = async (): Promise<GetAccountInfoResponse> => {
    const response = await api.get<GetAccountInfoResponse>('/users/account');
    return response.data;
};

export const useGetAccountInfo = () => {
    return useQuery({
        queryKey: ['accountInfo'],
        queryFn: getAccountInfo,
        throwOnError: (error: AxiosError<ErrorResponse>) => {
            const message = error.response?.data.message;
            if (message === '계좌 정보를 찾을 수 없습니다.') {
                return false;
            }
            return true;
        },
    });
};
