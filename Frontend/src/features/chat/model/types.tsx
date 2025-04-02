import { ChatMessage } from '@/entities/chat/model/types';
import { InfinitySlice } from '@/shared/model/types';

export interface ChatRoom {
    formId: string; // formId
    creditorId: string;
    creditorName: string;
    debtorId: string;
    debtorName: string;
    lastMessage: string;
    lastMessageTime: string[];
    unreadCount: string;
    isCompleted: boolean;
}

// 채팅방 목록 response
export type ChatRoomsResponse = {
    content: ChatRoom[];
} & InfinitySlice;

// 개별 채팅 내역 request
export type ChatHistoryRequest = {
    formId: string;
} & { page: string } & { size: string };

// 개별 채팅 내역 response
export type ChatHistoryResponse = { content: ChatMessage[] } & InfinitySlice;
