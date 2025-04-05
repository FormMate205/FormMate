import { useCallback, useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface UseNavigationGuardProps {
    shouldBlock?: boolean;
}

const useNavigationGuard = ({
    shouldBlock = true,
}: UseNavigationGuardProps = {}) => {
    const [showModal, setShowModal] = useState(false);
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            shouldBlock && currentLocation.pathname !== nextLocation.pathname,
    );

    useEffect(() => {
        if (blocker.state === 'blocked') {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [blocker]);

    const confirmNavigation = useCallback(() => {
        blocker.proceed?.();
        setShowModal(false);
    }, [blocker]);

    const cancelNavigation = useCallback(() => {
        blocker.reset?.();
        setShowModal(false);
    }, [blocker]);

    return {
        showModal,
        confirmNavigation,
        cancelNavigation,
    };
};

export default useNavigationGuard;
