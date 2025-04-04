export interface Notification {
    alertId: string;
    alertType: '연체' | '입금' | '출금' | '상환일';
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export type NotificationIconType = 'exclamation' | 'message' | 'contract';
export interface NotificationItemProps {
    alertId: string;
    icon: NotificationIconType;
    title: string;
    content: string;
    createdAt: string;
}
