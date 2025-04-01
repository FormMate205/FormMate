import { CompatClient, Stomp } from '@stomp/stompjs';
import { useRef, useState, useEffect } from 'react';
import { getMessages } from '../../../entities/chat/api/chatAPI';
import { ChatMessage } from '../../../entities/chat/model/types';

interface useConnectWsProps {
    userId: string;
    userName: string;
    roomId: string | undefined;
}

export const useConnectWs = ({
    userId,
    userName,
    roomId,
}: useConnectWsProps) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // 채팅 내역
    const [message, setMessage] = useState(''); // 채팅 입력
    const [isConnected, setIsConnected] = useState(false); // 연결 상태

    const stompClient = useRef<CompatClient | null>(null); // 웹소켓 연결 유지
    const scrollRef = useRef<HTMLDivElement | null>(null); // 새 메시지 추가 시 스크롤 이동

    // 웹소켓 연결
    const connect = () => {
        if (!roomId) {
            console.log('유효한 채팅방이 없습니다.');
            return;
        }

        try {
            const socket = new WebSocket(import.meta.env.VITE_WS_URI);
            stompClient.current = Stomp.over(socket);

            stompClient.current.connect({}, () => {
                setIsConnected(true);
                // 채팅방 구독
                stompClient.current!.subscribe(
                    `/sub/chat/${roomId}`,
                    (message) => {
                        try {
                            // 새 메시지 전송
                            const newMessage = JSON.parse(message.body);
                            setChatHistory((prevMessages) => [
                                ...prevMessages,
                                newMessage,
                            ]);

                            // 메시지가 추가되면 스크롤을 아래로 이동
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop =
                                    scrollRef.current.scrollHeight;
                            }
                        } catch (error) {
                            console.error('메시지 전송을 실패했습니다.', error);
                        }
                    },
                );

                // 채팅 내역 가져오기
                fetchChatHistory();
            });
        } catch (error) {
            console.error('웹소켓 연결을 실패했습니다.', error);
        }
    };

    // 웹소켓 연결 해제
    const disconnect = () => {
        if (stompClient.current) {
            try {
                stompClient.current.disconnect();
                setIsConnected(false);
            } catch (error) {
                console.error('웹소켓 연결 해제를 실패했습니다.', error);
            }
        }
    };

    // 채팅 내역 가져오기
    const fetchChatHistory = async () => {
        try {
            const data = await getMessages(roomId!);
            setChatHistory(data);

            // 스크롤 아래로 이동
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                        scrollRef.current.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('채팅 내역을 가져오지 못했습니다.', error);
        }
    };

    // 메시지 전송
    const sendMessage = () => {
        if (!stompClient.current || !message.trim()) {
            return;
        }

        try {
            const newMessage = {
                roomId: roomId,
                writerId: userId,
                writerName: userName,
                message: message.trim(),
            };

            stompClient.current.send(
                `/pub/message`,
                {},
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

        return () => {
            disconnect();
        };
    }, [roomId]);

    return {
        chatHistory,
        message,
        setMessage,
        sendMessage,
        isConnected,
        scrollRef,
    };
};
