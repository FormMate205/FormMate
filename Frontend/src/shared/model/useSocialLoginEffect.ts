import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/oauth/callback') {
            console.log(
                '---- pathname이 /oauth/callback이 아니라서 useSocialLoginEffect.ts 실행 안됨.',
            );
            return;
        }

        const params = new URLSearchParams(location.search);
        const authCode = params.get('authCode');

        if (!authCode) {
            console.error('인증 코드가 누락되었습니다');
            navigate('/login');
            return;
        }
        console.log('소셜 로그인 콜백 처리 시작, 인증 코드:', authCode);

        const handleSocialLogin = async () => {
            try {
                const tokenRes = await exchangeCodeForToken(authCode);
                const accessToken = tokenRes.headers['authorization']?.replace(
                    'Bearer ',
                    '',
                );

                if (!accessToken) {
                    console.error('응답에 액세스 토큰이 없습니다');
                    return navigate('/login');
                }

                console.log('액세스 토큰 받음:', accessToken);
                localStorage.setItem('accessToken', accessToken);

                const { userId, userName, email, needsAdditionalInfo } =
                    tokenRes.data;

                if (needsAdditionalInfo) {
                    console.log('추가 정보 입력 필요, 해당 페이지로 이동');
                    sessionStorage.setItem('oauthAuthCode', authCode);
                    navigate('/login/oauthInfo');
                } else {
                    setUser({
                        id: userId,
                        userName,
                        email,
                        isLogged: true,
                        hasAccount: true,
                    });

                    // 홈으로 이동
                    navigate('/');
                }

                // const res = await fetch('/api/login/oauth2/code/google', {
                //     credentials: 'include',
                // });

                // console.log('------ fetch 응답: ', res);
                // const data = await res.json();
                // console.log('-------- fetch 응답 json: ', data);
                // const authCode = res.headers.get('x-auth-code');
                // console.log('---------- 헤더에 담긴 auth-code: ', authCode);

                // if (!authCode) {
                //     console.error('X-Auth-Code 헤더가 없습니다.');
                //     return navigate('/login');
                // }

                // if (data.needsAdditionalInfo) {
                //     console.log('****** 추가정보 필요함');
                //     sessionStorage.setItem('oauthAuthCode', authCode);
                //     navigate('/login/oauthInfo');
                // } else {
                //     const tokenRes = await exchangeCodeForToken(authCode);
                //     const accessToken = tokenRes.headers[
                //         'authorization'
                //     ]?.replace('Bearer ', '');

                //     if (accessToken) {
                //         console.log('accessToken :', accessToken);
                //         localStorage.setItem('accessToken', accessToken);
                //     }

                //     const { userId, userName, email, hasAccount } =
                //         tokenRes.data;

                //     setUser({
                //         id: userId,
                //         userName,
                //         email,
                //         isLogged: true,
                //         hasAccount: hasAccount ?? true,
                //     });

                //     navigate('/');
                // }
            } catch (err) {
                console.error('소셜 로그인 처리 중 에러 발생:', err);
                navigate('/login');
            }
        };

        handleSocialLogin();
    }, [location, navigate, setUser]);
};
