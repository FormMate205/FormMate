// src/shared/hooks/useNavigateRoute.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseNavigateRouteProps {
    /** 뒤로가기 시 이동할 경로 (기본값: '/') */
    navigateTo?: string;
    /** 뒤로가기 방지 여부 (기본값: true) */
    enabled?: boolean;
    /** 뒤로가기 시 실행할 추가 콜백 함수 */
    onBack?: () => void;
}

/**
 * 브라우저 뒤로가기를 방지하고 지정된 경로로 리다이렉트하는 훅
 * @example
 * ```tsx
 * // 기본 사용 (뒤로가기 시 홈으로 이동)
 * useNavigateRoute();
 *
 * // 특정 경로로 이동
 * useNavigateRoute({ navigateTo: '/dashboard' });
 *
 * // 조건부로 활성화
 * useNavigateRoute({ enabled: shouldPreventBack });
 *
 * // 뒤로가기 시 추가 동작 실행
 * useNavigateRoute({
 *   onBack: () => {
 *     console.log('뒤로가기 감지');
 *     // 추가 로직...
 *   }
 * });
 * ```
 */
export const useNavigateRoute = ({
    navigateTo = '/',
    enabled = true,
    onBack,
}: UseNavigateRouteProps = {}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!enabled) return;

        // 현재 페이지에 히스토리 상태 추가
        window.history.pushState(null, '', window.location.pathname);

        const handlePopState = () => {
            // 추가 콜백 실행
            onBack?.();

            // 지정된 경로로 리다이렉트
            navigate(navigateTo, { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, navigateTo, enabled, onBack]);

    // 프로그래밍 방식으로 지정된 경로로 이동하는 함수 제공
    const navigateWithReplace = () => {
        navigate(navigateTo, { replace: true });
    };

    return { navigateWithReplace };
};
