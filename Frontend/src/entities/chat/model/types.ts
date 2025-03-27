// 채팅 메시지
export interface ChatMessage {
    id: string;
    writerId: string;
    content: string;
}

export interface Writer {
    writerId: string;
    name: string;
}
