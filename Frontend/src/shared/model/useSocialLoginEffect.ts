import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        if (location.pathname !== '/oauth/callback') return;

        const handleSocialLogin = async () => {
            try {
                const res = await fetch('/api/login/oauth2/code/google', {
                    credentials: 'include',
                });

                console.log('------ fetch 응답: ', res);
                const data = await res.json();
                console.log('-------- fetch 응답 json: ', data);
                const authCode = res.headers.get('x-auth-code');
                console.log('---------- 헤더에 담긴 auth-code: ', authCode);

                if (!authCode) {
                    console.error('X-Auth-Code 헤더가 없습니다.');
                    return navigate('/login');
                }

                if (data.needsAdditionalInfo) {
                    console.log('****** 추가정보 필요함');
                    sessionStorage.setItem('oauthAuthCode', authCode);
                    navigate('/login/oauthInfo');
                } else {
                    const tokenRes = await exchangeCodeForToken(authCode);
                    const accessToken = tokenRes.headers[
                        'authorization'
                    ]?.replace('Bearer ', '');

                    if (accessToken) {
                        console.log('accessToken :', accessToken);
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
