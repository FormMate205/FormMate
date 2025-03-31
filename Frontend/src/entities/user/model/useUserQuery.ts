import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUser';

export const useUserQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled:
            typeof window !== 'undefined' &&
            !!localStorage.getItem('accessToken'),
        staleTime: 1000 * 60 * 10, // 10분
        retry: false,
        refetchOnWindowFocus: false,
    });
};
