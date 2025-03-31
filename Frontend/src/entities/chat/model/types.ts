// 채팅 메시지
export interface ChatMessage {
    id: string;
    roomId?: string;
    writerId: string;
    writerName: string;
    content: string;
}

export interface Writer {
    writerId: string;
    name: string;
}
