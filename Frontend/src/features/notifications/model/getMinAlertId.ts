import { Notification } from '@/entities/notification/model/types';

export const getMinAlertId = (notifications: Notification[]): string | null => {
    if (!notifications.length) return null;
    const minId = notifications
        .map((n) => parseInt(n.alertId, 10))
        .reduce((min, id) => Math.min(min, id), Infinity);

    return minId.toString();
};
