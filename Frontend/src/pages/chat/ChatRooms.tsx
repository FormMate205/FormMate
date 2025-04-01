import { useEffect, useState } from 'react';
import { ChatRoom } from '@/features/chat/model/types';
import ChatRoomItem from '@/features/chat/ui/ChatRoomItem';
import { TagItem } from '@/shared';
import { Footer, Header } from '@/widgets';

const ChatRooms = () => {
    const activeDummy: ChatRoom[] = [
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
        {
            roomId: '1',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '상대승인전',
        },
    ];

    const inactiveDummy: ChatRoom[] = [
        {
            roomId: '2',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '2',
            debtorName: '이폼폼',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '종료',
        },
        {
            roomId: '2',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '2',
            debtorName: '이폼폼',
            lastMessage: '하이',
            lastTime: '오후 6:18',
            unreadCount: '3',
            status: '종료',
        },
    ];

    const [activeRooms, setActiveRooms] = useState<ChatRoom[]>(activeDummy);
    const [inactiveRooms, setInactiveRooms] =
        useState<ChatRoom[]>(inactiveDummy);

    useEffect(() => {
        setActiveRooms(activeDummy);
        setInactiveRooms(inactiveDummy);
    }, []);

    return (
        <div className='flex h-screen w-full flex-col px-4 py-2'>
            <div className='flex-none'>
                <Header title='채팅 목록' />
            </div>

            <div className='scrollbar-none flex-grow overflow-y-auto'>
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col gap-5'>
                        {activeRooms &&
                            activeRooms.map((room) => (
                                <ChatRoomItem
                                    key={room.roomId}
                                    partnerName={room.debtorName}
                                    lastMessage={room.lastMessage}
                                    unreadCount={room.unreadCount}
                                    lastTime={room.lastTime}
                                    isFin={room.status == '종료'}
                                />
                            ))}
                    </div>

                    <div className='flex flex-col gap-5'>
                        <TagItem text='종료' color='line' />
                        {inactiveRooms &&
                            inactiveRooms.map((room) => (
                                <ChatRoomItem
                                    key={room.roomId}
                                    partnerName={room.debtorName}
                                    lastMessage={room.lastMessage}
                                    unreadCount={room.unreadCount}
                                    lastTime={room.lastTime}
                                    isFin={room.status == '종료'}
                                />
                            ))}
                    </div>
                </div>
            </div>

            <div className='flex-none'>
                <Footer />
            </div>
        </div>
    );
};

export default ChatRooms;
