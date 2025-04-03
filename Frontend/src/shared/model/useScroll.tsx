import { RefObject, useRef, useState } from 'react';

interface UseScrollProps {
    loadPreviousMessages: () => Promise<T>;
    hasMoreMessages: boolean;
    isLoading: boolean;
    messageListRef: RefObject<HTMLDivElement>;
}

export const useScroll = ({
    loadPreviousMessages,
    hasMoreMessages,
    isLoading,
    messageListRef,
}: UseScrollProps) => {
    // 스크롤 관련 상태
    const scrollRef = messageListRef || useRef<HTMLDivElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [isNearBottom, setIsNearBottom] = useState(true);

    // 스크롤을 최하단으로 이동시키는 함수
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current && shouldScrollToBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [shouldScrollToBottom, scrollRef]);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const scrollPosition = scrollTop + clientHeight;

        // 스크롤이 하단에서 30px 이내인 경우 하단으로 간주
        const isBottom = scrollHeight - scrollPosition < 30;
        setIsNearBottom(isBottom);

        // 스크롤이 상단에 가까우면서 더 불러올 메시지가 있고 현재 로딩 중이 아닌 경우 이전 메시지 로드
        if (scrollTop < 100 && hasMoreMessages && !isLoading) {
            // 현재 스크롤 위치와 높이 저장
            const prevScrollHeight = scrollHeight;

            loadPreviousMessages().then(() => {
                // 스크롤 위치 유지
                if (scrollRef.current) {
                    const newScrollHeight = scrollRef.current.scrollHeight;
                    scrollRef.current.scrollTop =
                        scrollTop + (newScrollHeight - prevScrollHeight);
                }
            });
        }

        // 사용자가 스크롤을 움직이면 자동 스크롤 여부 결정
        setShouldScrollToBottom(isBottom);
    }, [loadPreviousMessages, hasMoreMessages, isLoading, scrollRef]);

    // 스크롤 이벤트 리스너 등록
    useEffect(() => {
        const currentScrollRef = scrollRef.current;
        if (currentScrollRef) {
            currentScrollRef.addEventListener('scroll', handleScroll);
            return () => {
                currentScrollRef.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll, scrollRef]);

    // 새 메시지 작성 시 스크롤 강제로 아래로 이동시키는 메서드
    const forceScrollToBottom = useCallback(() => {
        setShouldScrollToBottom(true);
        setTimeout(scrollToBottom, 100); // 상태 업데이트 후 약간의 지연을 두고 스크롤 실행
    }, [scrollToBottom]);

    return {
        scrollRef,
        isNearBottom,
        scrollToBottom,
        forceScrollToBottom,
    };
};
