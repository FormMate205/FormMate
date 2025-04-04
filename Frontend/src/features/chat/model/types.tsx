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
    page: string;
    size: string;
};

// 개별 채팅 내역 response
export type ChatHistoryResponse = { content: ChatMessage[] } & InfinitySlice;

// 서명 request
export type SignatureRequest = {
    formId: string;
    userName: string;
    phoneNumber: string;
};

// 계약파기 요청 response
export type TerminationResponse = {
    requestedById: string;
};

// 계약파기 확인 request
export type TerminationRequest = {
    formId: string;
    phoneNumber: string;
    verificationCode: string;
    recaptchaToken: string;
};
