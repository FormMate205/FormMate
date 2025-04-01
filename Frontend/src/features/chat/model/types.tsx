export interface ChatRoom {
    roomId: string;
    creditorId: string;
    creditorName: string;
    debtorId: string;
    debtorName: string;
    lastMessage: string;
    lastTime: string;
    unreadCount: string;
    status: '상대승인전' | '상대승인후' | '진행중' | '연체' | '종료';
}
