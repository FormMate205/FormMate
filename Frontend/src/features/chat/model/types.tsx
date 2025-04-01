import { ChatMessage } from '@/entities/chat/model/types';
import { InfinitySlice } from '@/shared/model/types';

export interface ChatRoom {
    roomId: string; // formId
    creditorId: string;
    creditorName: string;
    debtorId: string;
    debtorName: string;
    lastMessage: string;
    lastMessageTime: string[];
    unreadCount: string;
}

// 개별 채팅 내역 response
export type ChatHistoryResponse = { content: ChatMessage[] } & InfinitySlice;

// 채팅 목록 response
export type ChatRoomsResponse = { activeChatRooms: { content: ChatRoom[] } };
