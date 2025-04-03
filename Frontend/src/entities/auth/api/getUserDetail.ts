import { useQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { GetUserDetailResponse } from '../model/types';

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
