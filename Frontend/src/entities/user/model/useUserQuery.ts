import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUser';
import { User } from './types';
import { useUserStore } from './userStore';

export const useUserQuery = () => {
    const setUser = useUserStore((state) => state.setUser);

    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        select: (data: User) => {
            setUser(data);
            return data;
        },
        enabled:
            typeof window !== 'undefined' &&
            !!localStorage.getItem('accessToken'),
        staleTime: 1000 * 60 * 10,
        retry: false,
        refetchOnWindowFocus: false,
    });
};
