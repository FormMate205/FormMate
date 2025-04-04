import { Notification } from '@/entities/notification/model/types';

export const getMinAlertId = (
    notifications?: Notification[],
): string | null => {
    if (!notifications || !notifications.length) return null;
    const minId = notifications
        .map((n) => Number(n.alertId))
        .reduce((min, id) => Math.min(min, id), Infinity);

    return minId.toString();
};
