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
                    console.error(
                        '인증 코드가 없습니다. 로그인 페이지로 이동동',
                    );
                    navigate('/login');
                    return;
                }

                console.log('인증 코드:', authCode);
                console.log('추가 정보 필요 여부:', needsAdditionalInfo);

                if (needsAdditionalInfo) {
                    console.log('추가 정보 입력이 필요합니다');
                    sessionStorage.setItem('oauthAuthCode', authCode);
                    console.log(
                        '리다이렉트 직전 - 현재 URL:',
                        window.location.href,
                    );
                    try {
                        // 타임아웃을 사용하여 비동기적으로 리다이렉트
                        console.log('타임아웃으로 리다이렉트 시도');
                        setTimeout(() => {
                            console.log('타임아웃 내부 - 리다이렉트 실행');
                            window.location.href = '/login/oauthInfo';
                        }, 100);

                        // 백업 리다이렉트 방식도 시도
                        console.log('직접 리다이렉트 시도');
                        window.location.replace('/login/oauthInfo');
                    } catch (e) {
                        console.error('리다이렉트 중 에러 발생:', e);
                    }
                    return;
                }

                // 인증 코드로 토큰 교환
                console.log('토큰 교환 시도...');
                const response = await exchangeCodeForToken(authCode);

                // 액세스 토큰 확인 및 저장
                const accessToken =
                    response.headers['authorization'] ||
                    response.headers['Authorization'];
                console.log('받은 액세스 토큰:', accessToken);

                if (!accessToken) {
                    console.error(
                        '액세스 토큰이 없습니다. 로그인 페이지로 이동',
                    );
                    navigate('/login');
                    return;
                }

                const tokenValue = accessToken.startsWith('Bearer ')
                    ? accessToken.replace('Bearer ', '')
                    : accessToken;

                localStorage.setItem('accessToken', tokenValue);
                console.log('액세스 토큰 저장 완료');

                // 사용자 정보 설정
                const { userId, userName, email } = response.data;
                console.log('사용자 정보:', { userId, userName, email });

                setUser({
                    id: userId,
                    userName,
                    email,
                    isLogged: true,
                    hasAccount: true,
                });

                console.log('사용자 로그인 처리 완료');
                navigate('/');
            } catch (e) {
                console.error(
                    'OAuth 콜백 처리 중 오류 발생(로그인 페이지로 이동):',
                    e,
                );
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [params, navigate, setUser]);

    return null; // 로딩 상태 보여줘도 됨
};

export default OAuthCallback;
