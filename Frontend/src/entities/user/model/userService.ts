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
                if (
                    !location.pathname.startsWith('/login') &&
                    location.pathname !== '/oauth/callback'
                ) {
                    navigate('/login');
                }
                clearUser();
            }
        }
    }, [data, isLoading, setUser, setLoggedIn, clearUser, navigate, location]);
};
