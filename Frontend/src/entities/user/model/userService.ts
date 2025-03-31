import { useEffect } from 'react';
import { useUserStore } from './userStore';
import { useUserQuery } from './useUserQuery';

export const useUserService = () => {
    const { data, isLoading } = useUserQuery();
    // const { setUser, setLoggedIn, clearUser } = useUserStore();
    const setUser = useUserStore((state) => state.setUser);
    const setLoggedIn = useUserStore((state) => state.setLoggedIn);
    const clearUser = useUserStore((state) => state.clearUser);

    useEffect(() => {
        if (!isLoading && data) {
            setUser(data);
            setLoggedIn(true);
        } else {
            clearUser();
        }
    }, [isLoading, data, setUser, setLoggedIn, clearUser]);

    return;
};
