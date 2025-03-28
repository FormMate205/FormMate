import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUser';

export const useUserQuery = () => {
    const token = localStorage.getItem('accessToken');

    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: !!token, // 토큰 있을 때만 fetch
        staleTime: 1000 * 60 * 10, // 10분
        retry: false,
        refetchOnWindowFocus: false,
    });
};
