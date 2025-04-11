import { Stomp } from '@stomp/stompjs';

export const createStompClient = () => {
    const socketFactory = () => new WebSocket(`${import.meta.env.VITE_WS_URI}`);
    const client = Stomp.over(socketFactory);

    // 추가 설정
    // client.reconnect_delay = 5000;

    return client;
};
