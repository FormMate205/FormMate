// src/entities/notification/model/types.ts
export type NotificationIconType = 'exclamation' | 'message' | 'contract';

export interface NotificationItemProps {
    icon: NotificationIconType;
    title: string;
    content: string;
    iconColorClass?: string;
}
