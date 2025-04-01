import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessToken, isTokenValid } from '@/shared/api/token';
import { useUserStore } from './userStore';
import { useUserQuery } from './useUserQuery';

export const useUserService = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading } = useUserQuery();
    const setUser = useUserStore((state) => state.setUser);
    const setLoggedIn = useUserStore((state) => state.setLoggedIn);
    const clearUser = useUserStore((state) => state.clearUser);

    const token = getAccessToken();

    useEffect(() => {
        if (token && isTokenValid()) {
            setLoggedIn(true);
        } else {
            clearUser();
        }
    }, [token, setLoggedIn, clearUser]);

    useEffect(() => {
        const currentPath = location.pathname;
        const publicPaths = ['/landing', '/login'];
        const isPublicPath = publicPaths.some((path) =>
            currentPath.startsWith(path),
        );

        if (!token && !isPublicPath) {
            navigate('/landing', { replace: true });
            return;
        }

        if (!isLoading && data) {
            setUser(data);
            setLoggedIn(true);
        }
    }, [
        isLoading,
        data,
        token,
        navigate,
        location.pathname,
        setUser,
        setLoggedIn,
    ]);

    return;
};
