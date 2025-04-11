import { CompatClient, Message } from '@stomp/stompjs';
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
    const reconnectTimeoutRef = useRef<
        ReturnType<typeof setTimeout> | undefined
    >(undefined); // 재연결 타이머
    const lastMessageTimeRef = useRef<number>(0); // 마지막 메시지 시간 저장

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
            // 스크롤이 하단에 가까운 경우에만 자동 스크롤
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

            if (isNearBottom) {
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

        if (stompClient.current?.connected) {
            return;
        }

        stompClient.current = createStompClient();

        stompClient.current.connect(
            {
                Authorization: localStorage.getItem('accessToken'),
            },
            () => {
                setIsConnected(true);
                console.log('WebSocket Connected');

                stompClient.current?.subscribe(
                    `/topic/chat${roomId}`,
                    (message: Message) => {
                        try {
                            const currentTime = Date.now();
                            // 메시지 처리 간격이 100ms 이내면 무시 (중복 방지)
                            if (
                                currentTime - lastMessageTimeRef.current <
                                100
                            ) {
                                return;
                            }
                            lastMessageTimeRef.current = currentTime;

                            const parsedMessage = JSON.parse(message.body);
                            console.log('New message received:', parsedMessage);
                            refetch();
                        } catch (error: unknown) {
                            console.error('Error processing message:', error);
                        }
                    },
                );
            },
            (error: unknown) => {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
                // 연결 실패시 3초 후 재시도
                reconnectTimeoutRef.current = setTimeout(connect, 3000);
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

        // Visibility 변경 감지
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                connect(); // 페이지가 보일 때 재연결
                refetch(); // 놓친 메시지 동기화
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (stompClient.current?.connected) {
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
