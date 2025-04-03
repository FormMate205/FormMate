import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';

export interface GetUserDetailResponse {
    userId: number;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    addressDetail: string;
    bankName: string;
    accountNumber: string;
}

const fetchUserDetail = async (): Promise<GetUserDetailResponse> => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const useGetUserDetail = () => {
    return useQuery({
        queryKey: ['userDetail'],
        queryFn: fetchUserDetail,
    });
};
