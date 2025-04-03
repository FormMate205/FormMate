import { Notification } from '@/entities/notification/model/types';

// 가장 작은 alertId를 찾기
export const getMinAlertId = (notifications: Notification[]): string => {
    return Math.min(
        ...notifications.map((n) => parseInt(n.alertId, 10)),
    ).toString();
};
