import { Pagenation, PagenationRequest } from '@/shared/model/types';

export interface Notification {
    alertId: string;
    alertType: '연체' | '입금' | '출금' | '상환일';
    content: string;
    isRead: boolean;
    createdAt: boolean;
}

// 읽지 않은 알림 조회
export type GetUnreadNotificationListResponse = {
    content: Notification[];
};

// 읽은 알림 추가 조회
export type GetNotificationListRequest = {
    alertId: string;
} & PagenationRequest;

export type GetNotificationListResposne = {
    content: Notification[];
} & Pagenation;

// 읽지 않은 알림 개수 조회
export type GetUnreadNotificationCountResponse = {
    unreadAlertCount: number;
};
