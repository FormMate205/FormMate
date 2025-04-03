import { Stomp } from '@stomp/stompjs';

export const createStompClient = () => {
    const socketFactory = () => new WebSocket('https://j12a205.p.ssafy.io/ws/');
    const client = Stomp.over(socketFactory);

    // 추가 설정
    // client.reconnect_delay = 5000;

    return client;
};
