import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { isTokenValid } from '@/entities/auth/model/authService';
import { useUserStore } from './userStore';
import { useUserQuery } from './useUserQuery';

export const useUserService = () => {
    const navigate = useNavigate();
    // const location = useLocation();

    const { data, isLoading } = useUserQuery();
    const { setUser, setLoggedIn, clearUser } = useUserStore();

    // const setUser = useUserStore((state) => state.setUser);
    // const setLoggedIn = useUserStore((state) => state.setLoggedIn);
    // const clearUser = useUserStore((state) => state.clearUser);

    // const token = localStorage.getItem('accessToken');

    // useEffect(() => {
    //     if (token && isTokenValid()) {
    //         setLoggedIn(true);
    //     } else {
    //         clearUser();
    //     }
    // }, [token, setLoggedIn, clearUser]);

    // useEffect(() => {
    //     const currentPath = location.pathname;
    //     const publicPaths = ['/landing', '/login'];
    //     const isPublicPath = publicPaths.some((path) =>
    //         currentPath.startsWith(path),
    //     );

    //     if (!token && !isPublicPath) {
    //         navigate('/landing', { replace: true });
    //         return;
    //     }

    //     if (!isLoading && data) {
    //         setUser(data);
    //         setLoggedIn(true);
    //     }
    // }, [
    //     isLoading,
    //     data,
    //     token,
    //     navigate,
    //     location.pathname,
    //     setUser,
    //     setLoggedIn,
    // ]);

    //     return;
    // };
    useEffect(() => {
        if (!isLoading) {
            if (data) {
                setUser(data);
                setLoggedIn(true);
            } else {
                clearUser();
                navigate('/login'); // 로그인 페이지로 리다이렉트
            }
        }
    }, [data, isLoading, setUser, setLoggedIn, clearUser, navigate]);
};
