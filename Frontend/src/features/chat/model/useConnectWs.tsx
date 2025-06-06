import { CompatClient } from '@stomp/stompjs';
import { useRef, useState, useEffect } from 'react';
import { User } from '@/entities/user/model/types';
import { createStompClient } from '@/features/chat/model/wsService';
import { useGetMessages } from '../api/chatAPI';

interface useConnectWsProps {
    user: User | null;
    roomId: string | undefined;
}

export const useConnectWs = ({ roomId }: useConnectWsProps) => {
    const [message, setMessage] = useState(''); // 채팅 입력
    const scrollRef = useRef<HTMLDivElement | null>(null); // 새 메시지 추가 시 스크롤 이동
    const prevMessagesLengthRef = useRef<number>(0); // 이전 메시지 개수를 저장
    const scrollPositionRef = useRef<number>(0); // 스크롤 위치 저장
    const scrollHeightRef = useRef<number>(0); // 이전 스크롤 높이 저장

    const stompClient = useRef<CompatClient | null>(null); // 웹소켓 연결 유지
    const [isConnected, setIsConnected] = useState(false); // 연결 상태
    const [isLoadingMore, setIsLoadingMore] = useState(false); // 추가 데이터 로드 중 상태

    // 채팅 내역 가져오기
    const { messages, formInfo, fetchNextPage, lastItemRef, refetch } =
        useGetMessages({
            formId: roomId!,
            page: '0',
            size: '20',
        });

    // 메시지가 변경될 때 스크롤 위치 조정
    useEffect(() => {
        if (!scrollRef.current) return;

        // 새 메시지가 추가된 경우
        if (messages.length > prevMessagesLengthRef.current) {
            // 스크롤이 최하단에 있을 때만 자동 스크롤
            const isAtBottom =
                scrollRef.current.scrollHeight - scrollRef.current.scrollTop <=
                scrollRef.current.clientHeight + 100;

            if (isAtBottom) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }

        prevMessagesLengthRef.current = messages.length;
    }, [messages]);

    // 스크롤이 상단에 가까워지면 다음 페이지 로드
    const handleScroll = () => {
        if (scrollRef.current && !isLoadingMore) {
            const { scrollTop, scrollHeight } = scrollRef.current;
            const buffer = 20; // 픽셀 단위의 버퍼

            // 스크롤이 상단에 가까워지면
            if (scrollTop <= buffer) {
                // 현재 스크롤 위치와 높이 저장
                scrollPositionRef.current = scrollTop;
                scrollHeightRef.current = scrollHeight;

                setIsLoadingMore(true);
                fetchNextPage().finally(() => {
                    setIsLoadingMore(false);
                });
            }
        }
    };

    // 스크롤 이벤트 등록/해제
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => {
                scrollElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isLoadingMore]);

    // 웹소켓 연결
    const connect = () => {
        if (!roomId) {
            return;
        }

        stompClient.current = createStompClient();

        // 자동 재연결 설정
        stompClient.current.reconnect_delay = 500;

        stompClient.current.connect(
            {
                Authorization: localStorage.getItem('accessToken'),
            },
            () => {
                setIsConnected(true);

                stompClient.current?.subscribe(`/topic/chat${roomId}`, () => {
                    // 새 메시지가 도착하면 즉시 refetch
                    refetch();
                });
            },
            () => {
                setIsConnected(false);
            },
        );
    };

    // 메시지 전송
    const sendMessage = () => {
        if (!stompClient.current || !message.trim()) {
            return;
        }

        const newMessage = {
            formId: roomId,
            content: message.trim(),
            messageType: 'CHAT',
        };

        stompClient.current.send(
            '/app/chat.sendMessage',
            { 'Content-Type': 'application/json' },
            JSON.stringify(newMessage),
        );

        setMessage('');
    };

    // 컴포넌트 마운트 시 연결, 언마운트 시 연결 해제
    useEffect(() => {
        if (roomId) {
            connect();
        }

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [roomId]);

    return {
        messages,
        fetchNextPage,
        lastItemRef,
        message,
        formInfo,
        setMessage,
        sendMessage,
        isConnected,
        scrollRef,
    };
};
