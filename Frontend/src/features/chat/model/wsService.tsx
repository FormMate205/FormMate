import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createStompClient = () => {
    const socketFactory = () => new SockJS('/ws');
    const client = Stomp.over(socketFactory);

    // 추가 설정
    // client.reconnect_delay = 5000;

    return client;
};
