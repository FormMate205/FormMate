import { useState } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

const useNavigationGuard = () => {
    const [showModal, setShowModal] = useState(false);

    // 브라우저 새로고침 혹은 나가기 감지
    useBeforeUnload((event) => {
        event.preventDefault();
        event.returnValue =
            '페이지를 나가시겠습니까? 지금까지 입력한 내용은 사라집니다.';
        return event.returnValue;
    });

    // 경로 이탈 감지 시 모달 오픈
    const blocker = useBlocker(
        ({ currentLocation, nextLocation, historyAction }) => {
            // 브라우저 뒤로가기/앞으로가기 감지
            if (historyAction === 'POP') {
                setShowModal(true);
                return true;
            }

            // 경로 변경 감지
            if (currentLocation.pathname !== nextLocation.pathname) {
                setShowModal(true);
                return true;
            }

            // 헤더의 뒤로가기 감지
            if (historyAction === 'PUSH') {
                setShowModal(true);
                return true;
            }

            return false;
        },
    );

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
