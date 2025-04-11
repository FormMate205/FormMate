import { Notification } from '@/entities/notification/model/types';
import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 읽지 않은 알림 조회
export type GetUnreadNotificationListResponse = Notification[];

// 읽은 알림 조회
export type GetNotificationListRequest = {
    alertId: string | null;
} & PagenationRequest;

export type GetNotificationListResposne = {
    content: Notification[];
} & Pagenation;

// 읽지 않은 알림 개수 조회
export type GetUnreadNotificationCountResponse = {
    unreadAlertCount: number;
};
