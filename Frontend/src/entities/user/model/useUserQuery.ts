import { useQuery } from '@tanstack/react-query';
import { isTokenValid } from '@/entities/auth/model/authService';
import { getUser } from '../api/getUser';

export const useUserQuery = () => {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;
    const isValid = token ? isTokenValid() : false;

    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: isValid,
        staleTime: 1000 * 60 * 10, // 10분
        retry: false,
        refetchOnWindowFocus: false,
    });
};
