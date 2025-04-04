import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);
    const [hasExchanged, setHasExchanged] = useState(false);

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

                const { userId, userName, email, needsAdditionalInfo } =
                    response.data;

                setUser({
                    id: userId,
                    userName,
                    email,
                    isLogged: true,
                    hasAccount: false,
                });
                setHasExchanged(true);

                // 리디렉트 분기: 최초 소셜 로그인 여부
                if (needsAdditionalInfo) {
                    navigate('/login/oauthInfo', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('OAuth exchange 실패:', error);
                navigate('/login');
            }
        };

        fetch();
    }, [code, hasExchanged, navigate, setUser]);
};
