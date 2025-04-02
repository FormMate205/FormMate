import { CompatClient } from '@stomp/stompjs';
import { useRef, useState, useEffect } from 'react';
import { createStompClient } from '@/features/chat/model/wsService';
import { useGetMessages } from '../api/chatAPI';

interface useConnectWsProps {
    userId: string;
    userName: string;
    roomId: string | undefined;
}

export const useConnectWs = ({ roomId }: useConnectWsProps) => {
    const [message, setMessage] = useState(''); // 채팅 입력
    const [isConnected, setIsConnected] = useState(false); // 연결 상태

    const stompClient = useRef<CompatClient | null>(null); // 웹소켓 연결 유지
    const scrollRef = useRef<HTMLDivElement | null>(null); // 새 메시지 추가 시 스크롤 이동

    // 채팅 내역 가져오기
    const { messages, fetchNextPage, lastItemRef } = useGetMessages({
        formId: roomId!,
        page: '0',
        size: '15',
    });

    // 웹소켓 연결
    const connect = () => {
        if (!roomId) {
            console.log('유효한 채팅방이 없습니다.');
            return;
        }

        try {
            stompClient.current = createStompClient();

            stompClient.current.connect({}, () => {
                setIsConnected(true);

                stompClient.current?.subscribe(`/topic/chat${roomId}`, () => {
                    // 메시지가 추가되면 스크롤을 아래로 이동
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop =
                            scrollRef.current.scrollHeight;
                    }
                });
            });
        } catch (error) {
            console.error('웹소켓 연결을 실패했습니다.', error);
        }
    };

    // 웹소켓 연결 해제
    // const disconnect = () => {
    //     if (stompClient.current) {
    //         try {
    //             stompClient.current.disconnect();
    //             setIsConnected(false);
    //         } catch (error) {
    //             console.error('웹소켓 연결 해제를 실패했습니다.', error);
    //         }
    //     }
    // };

    // 메시지 전송
    const sendMessage = () => {
        if (!stompClient.current || !message.trim()) {
            console.log('메시지 전송 실패');
            return;
        }

        try {
            const newMessage = {
                formId: roomId,
                content: message.trim(),
                messageType: 'CHAT',
            };

            console.log('채팅 보내기: ', newMessage);

            stompClient.current.send(
                '/app/chat.sendMessage',
                {
                    Authorization: localStorage.getItem('accessToken'), // 헤더에 토큰 포함
                },
                JSON.stringify(newMessage),
            );
            setMessage('');
        } catch (error) {
            console.error('메시지를 전송하지 못했습니다.', error);
        }
    };

    // 컴포넌트 마운트 시 연결, 언마운트 시 연결 해제
    useEffect(() => {
        if (roomId) {
            connect();
        }
    }, [roomId]);

    return {
        messages,
        fetchNextPage,
        lastItemRef,
        message,
        setMessage,
        sendMessage,
        isConnected,
        scrollRef,
    };
};
