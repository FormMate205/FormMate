import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);
    const [hasExchanged, setHasExchanged] = useState(false);

    const code = searchParams.get('code');

    useEffect(() => {
        if (!code || hasExchanged) return;

        const fetch = async () => {
            try {
                const response = await exchangeCodeForToken(code);
                const accessToken = response.headers['authorization']?.replace(
                    'Bearer ',
                    '',
                );
                if (accessToken)
                    localStorage.setItem('accessToken', accessToken);

                setUser(response.data); // { userId, userName, email }
                setHasExchanged(true);
                navigate(window.location.pathname, { replace: true }); // code 제거
            } catch (error) {
                console.error('OAuth exchange 실패:', error);
                navigate('/login');
            }
        };

        fetch();
    }, [code, hasExchanged, navigate, setUser]);
};
