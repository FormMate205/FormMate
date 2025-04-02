import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from './userStore';
import { useUserQuery } from './useUserQuery';

export const useUserService = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useUserQuery();
    const { setUser, setLoggedIn, clearUser } = useUserStore();

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
