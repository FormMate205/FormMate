import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface UseNavigationGuardProps {
    shouldBlock: boolean;
}

const useNavigationGuard = (shouldBlock: UseNavigationGuardProps) => {
    const [showModal, setShowModal] = useState(false);

    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        return (
            shouldBlock && currentLocation.pathname !== nextLocation.pathname
        );
    });

    // 브라우저 나가기 감지
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        if (blocker.state === 'blocked') {
            setShowModal(true);
        } else {
            setShowModal(false);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [blocker]);

    // 경로 이탈 확정
    const confirmNavigation = () => {
        setShowModal(false);
        blocker.proceed?.();
    };

    // 경로 이탈 취소
    const cancelNavigation = () => {
        setShowModal(false);
        blocker.reset?.();
    };

    return {
        showModal,
        confirmNavigation,
        cancelNavigation,
    };
};

export default useNavigationGuard;
