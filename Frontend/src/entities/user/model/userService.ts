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
                console.log(
                    'useUserService: 사용자 데이터 없음, 리다이렉트 검사',
                );

                if (
                    !location.pathname.startsWith('/login') &&
                    location.pathname !== '/oauth/callback'
                ) {
                    console.log('useUserService: 로그인 페이지로 리다이렉트');
                    navigate('/login');
                } else {
                    console.log(
                        'useUserService: 로그인 관련 페이지이므로 리다이렉트 하지 않음',
                    );
                }
                clearUser();
            }
        }
    }, [data, isLoading, setUser, setLoggedIn, clearUser, navigate, location]);
};
