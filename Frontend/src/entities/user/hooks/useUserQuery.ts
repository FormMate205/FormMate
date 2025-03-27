import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUser';
import { useUserStore } from '../model/useUserStore';

export const useUserQuery = () => {
    const token = useUserStore((state) => state.token);

    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: !!token, // 토큰 있을 때만 fetch
        staleTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};
