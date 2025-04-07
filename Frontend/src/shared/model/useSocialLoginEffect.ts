import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSocialLoginEffect = () => {
    // const navigate = useNavigate();
    // const setUser = useUserStore((s) => s.setUser);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/oauth/callback') {
            return;
        }

        // const params = new URLSearchParams(location.search);
        // const authCode = params.get('authCode');

        // if (!authCode) {
        //     console.error('인증 코드가 누락되었습니다. 로그인 페이지로 이동');
        //     // navigate('/login');
        //     return;
        // }
        // console.log('소셜 로그인 콜백 처리 시작, authCode:', authCode);

        // const handleSocialLogin = async () => {
        //     try {
        //         const tokenRes = await exchangeCodeForToken(authCode);
        //         const accessToken = tokenRes.headers['authorization']?.replace(
        //             'Bearer ',
        //             '',
        //         );

        //         if (!accessToken) {
        //             console.error(
        //                 '응답에 액세스 토큰이 없습니다. 로그인 페이지로 이동',
        //             );
        //             // return navigate('/login');
        //         }

        //         console.log('액세스 토큰 받음:', accessToken);
        //         localStorage.setItem('accessToken', accessToken);

        //         const { userId, userName, email, needsAdditionalInfo } =
        //             tokenRes.data;

        //         if (needsAdditionalInfo) {
        //             console.log('추가 정보 입력 필요, 해당 페이지로 이동');
        //             sessionStorage.setItem('oauthAuthCode', authCode);
        //             navigate('/login/oauthInfo');
        //         } else {
        //             setUser({
        //                 id: userId,
        //                 userName,
        //                 email,
        //                 isLogged: true,
        //                 hasAccount: true,
        //             });

        //             // 홈으로 이동
        //             navigate('/');
        //         }
        //     } catch (err) {
        //         console.error(
        //             '소셜 로그인 처리 중 에러 발생(로그인 페이지로 이동):',
        //             err,
        //         );
        //         // navigate('/login');
        //     }
        // };

        // handleSocialLogin();
    }, [location]);
};
