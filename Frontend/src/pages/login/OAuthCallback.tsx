import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

const OAuthCallback = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const authCode = params.get('authCode');
                const needsAdditionalInfo =
                    params.get('needsAdditionalInfo') === 'true';

                if (!authCode) {
                    navigate('/login');
                    return;
                }

                if (needsAdditionalInfo) {
                    sessionStorage.setItem('oauthAuthCode', authCode);
                    setTimeout(() => {
                        window.location.href = '/login/oauthInfo';
                    }, 100);
                    window.location.replace('/login/oauthInfo');
                    return;
                }

                // 인증 코드로 토큰 교환
                const response = await exchangeCodeForToken(authCode);

                // 액세스 토큰 확인 및 저장
                let accessToken =
                    response.headers['authorization'] ||
                    response.headers['Authorization'] ||
                    response.headers.authorization ||
                    response.headers.Authorization;

                if (!accessToken && response.request) {
                    const allHeaders = response.request.getAllResponseHeaders();

                    // 문자열에서 authorization 헤더 추출 시도
                    const authMatch = /authorization:\s*([^\r\n]+)/i.exec(
                        allHeaders,
                    );
                    if (authMatch) {
                        accessToken = authMatch[1];
                    }
                }

                if (!accessToken) {
                    navigate('/login');
                    return;
                }

                localStorage.setItem('accessToken', accessToken);

                // 사용자 정보 설정
                const { userId, userName, email } = response.data;

                setUser({
                    id: userId,
                    userName,
                    email,
                    isLogged: true,
                    hasAccount: true,
                });

                navigate('/');
            } catch {
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [params, navigate, setUser]);

    return null; // 로딩 상태 보여줘도 됨
};

export default OAuthCallback;
