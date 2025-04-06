import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

const OAuthCallback = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        const authCode = params.get('authCode');
        const needsAdditionalInfo =
            params.get('needsAdditionalInfo') === 'true';
        const userName = params.get('userName') || '';
        const email = params.get('email') || '';
        const userId = params.get('userId');

        if (!authCode) {
            navigate('/login');
            return;
        }

        if (needsAdditionalInfo) {
            sessionStorage.setItem('oauthAuthCode', authCode); // 인증코드 임시 보관
            navigate('/login/oauthInfo');
        } else {
            (async () => {
                try {
                    const response = await exchangeCodeForToken(authCode); // POST 요청
                    const accessToken = response.headers[
                        'authorization'
                    ]?.replace('Bearer ', '');
                    if (accessToken) {
                        localStorage.setItem('accessToken', accessToken);
                    }

                    setUser({
                        id: userId!,
                        userName,
                        email,
                        isLogged: true,
                        hasAccount: true,
                    });

                    navigate('/');
                } catch (e) {
                    console.error('토큰 교환 실패', e);
                    navigate('/login');
                }
            })();
        }
    }, []);

    return null; // 로딩 상태 보여줘도 됨
};

export default OAuthCallback;
