import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from './userStore';
import { useUserQuery } from './useUserQuery';

export const useUserService = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useUserQuery();
    const { setUser, setLoggedIn, clearUser } = useUserStore();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading) {
            if (data) {
                setUser(data);
                setLoggedIn(true);
            } else {
                // navigate('/login'); // 로그인 페이지로 리다이렉트
                if (location.pathname !== '/login/oauthInfo') {
                    navigate('/login');
                }
                clearUser();
            }
        }
    }, [data, isLoading, setUser, setLoggedIn, clearUser, navigate]);
};
