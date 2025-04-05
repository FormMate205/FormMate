import { useEffect, useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

interface UseNavigationGuardProps {
    shouldBlock?: boolean;
}

const useNavigationGuard = ({
    shouldBlock = true,
}: UseNavigationGuardProps = {}) => {
    const [showModal, setShowModal] = useState(false);

    // 브라우저 새로고침 혹은 나가기 감지
    useBeforeUnload((event) => {
        event.preventDefault();
        event.returnValue =
            '페이지를 나가시겠습니까? 지금까지 입력한 내용은 사라집니다.';
        return event.returnValue;
    });

    const blocker = useBlocker(
        ({ currentLocation, nextLocation, historyAction }) => {
            // 브라우저 뒤로가기/앞으로가기 감지
            if (historyAction === 'POP') {
                setShowModal(true);
                return true;
            }

            return (
                shouldBlock &&
                currentLocation.pathname !== nextLocation.pathname
            );
        },
    );

    useEffect(() => {
        if (blocker.state === 'blocked') {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [blocker]);

    // 경로 이탈 확정
    const confirmNavigation = () => {
        blocker.proceed?.();
        setShowModal(false);
    };

    // 경로 이탈 취소
    const cancelNavigation = () => {
        blocker.reset?.();
        setShowModal(false);
    };

    return {
        showModal,
        confirmNavigation,
        cancelNavigation,
    };
};

export default useNavigationGuard;
