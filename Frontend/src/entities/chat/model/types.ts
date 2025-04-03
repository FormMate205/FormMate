// 채팅 메시지
export interface ChatMessage {
    id: string;
    roomId?: string; // formId
    writerId: string;
    writerName: string;
    content: string;
    isRead?: boolean;
    createdAt?: string[];
    messageType?:
        | 'CHAT'
        | 'CONTRACT_SHARED'
        | 'SIGNATURE_REQUEST'
        | 'SYSTEM_NOTIFICATION'; // 일반채팅, 계약서 공유, 서명 요청, 시스템 알림
    isCreditorMessage?: boolean;
    isDebtorMessage?: boolean;
}

export interface Writer {
    writerId: string;
    name: string;
}
