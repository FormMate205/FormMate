// 채팅 메시지
export interface ChatMessage {
    id: string;
    formId?: string;
    writerId: string;
    writerName: string;
    content: string;
    isRead?: boolean;
    createdAt?: string[];
    messageType?: MessageType; // 일반채팅, 계약서 공유, 서명 요청, 시스템 알림
    targetUserId?: string; // 서명 요청 시 서명 ID
}

export type MessageType =
    | 'CHAT'
    | 'CONTRACT_SHARED'
    | 'SIGNATURE_REQUEST_CONTRACT'
    | 'SIGNATURE_REQUEST_TERMINATION'
    | 'SYSTEM_NOTIFICATION';

export interface Writer {
    writerId: string;
    name: string;
}
