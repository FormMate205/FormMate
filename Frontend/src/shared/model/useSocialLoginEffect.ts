import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '@/entities/auth/api/exchangeCode';
import { useUserStore } from '@/entities/user/model/userStore';

export const useSocialLoginEffect = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const code = params.get('code');

        if (!code) return;

        // 인증 코드 처리
        (async () => {
            try {
                const user = await exchangeCodeForToken(code);
                setUser(user);
                navigate(window.location.pathname, { replace: true });
            } catch (err) {
                console.error('소셜 로그인 토큰 처리 실패:', err);
            }
        })();
    }, []);
};
