import { Notification, NotificationItemProps } from '../model/types';

export const mapNotificationListToItems = (
    notifications: Notification[] = [],
): NotificationItemProps[] => {
    return notifications.map(mapNotificationToItem);
};

export const mapNotificationToItem = (
    notification: Notification,
): NotificationItemProps => {
    let icon: NotificationItemProps['icon'];
    switch (notification.alertType) {
        case '연체':
            icon = 'exclamation';
            break;
        case '입금':
        case '출금':
            icon = 'contract';
            break;
        case '상환일':
        default:
            icon = 'message';
            break;
    }

    const date = new Date(notification.createdAt);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}.${String(
        date.getDate(),
    ).padStart(2, '0')}`;

    return {
        alertId: notification.alertId,
        icon,
        title: notification.title,
        content: notification.content,
        createdAt: formattedDate,
    };
};
