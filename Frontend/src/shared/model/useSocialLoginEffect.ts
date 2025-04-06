import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        const handleSocialLogin = async () => {
            try {
                const res = await fetch('/api/login/oauth2/code/google', {
                    credentials: 'include',
                });

                const data = await res.json();
                const authCode = res.headers.get('x-auth-code');

                if (!authCode) {
                    console.error('X-Auth-Code 헤더가 없습니다.');
                    return navigate('/login');
                }

                if (data.needsAdditionalInfo) {
                    sessionStorage.setItem('oauthAuthCode', authCode);
                    navigate('/login/oauthInfo');
                } else {
                    const tokenRes = await exchangeCodeForToken(authCode);
                    const accessToken = tokenRes.headers[
                        'authorization'
                    ]?.replace('Bearer ', '');

                    if (accessToken) {
                        localStorage.setItem('accessToken', accessToken);
                    }

                    const { userId, userName, email, hasAccount } =
                        tokenRes.data;

                    setUser({
                        id: userId,
                        userName,
                        email,
                        isLogged: true,
                        hasAccount: hasAccount ?? true,
                    });

                    navigate('/');
                }
            } catch (err) {
                console.error('소셜 로그인 처리 중 에러 발생:', err);
                navigate('/login');
            }
        };

        handleSocialLogin();
    }, [navigate, setUser]);
};
