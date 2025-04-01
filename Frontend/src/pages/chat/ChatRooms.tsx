import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertTime } from '@/features/chat/model/convertTime';
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
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '3',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '4',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '5',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '6',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '7',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '8',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '9',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '10',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '11',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '12',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '13',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '7',
            debtorName: '오은지',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
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
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
        {
            roomId: '20',
            creditorId: '9',
            creditorName: '강지은',
            debtorId: '2',
            debtorName: '이폼폼',
            lastMessage: '하이',
            lastMessageTime: ['2025', '04', '01', '11', '20'],
            unreadCount: '3',
        },
    ];

    const navigate = useNavigate();
    const [activeRooms, setActiveRooms] = useState<ChatRoom[]>(activeDummy);
    const [inactiveRooms, setInactiveRooms] =
        useState<ChatRoom[]>(inactiveDummy);

    useEffect(() => {
        setActiveRooms(activeDummy);
        setInactiveRooms(inactiveDummy);
    }, []);

    const onClick = (roomId: string) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className='flex h-screen w-full flex-col px-4 py-2'>
            <div className='flex-none'>
                <Header title='채팅 목록' />
            </div>

            <div className='scrollbar-none flex-grow overflow-y-auto py-2'>
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col'>
                        {activeRooms &&
                            activeRooms.map((room) => (
                                <ChatRoomItem
                                    key={room.roomId}
                                    partnerName={room.debtorName}
                                    lastMessage={room.lastMessage}
                                    unreadCount={room.unreadCount}
                                    lastMessageTime={convertTime(
                                        room.lastMessageTime,
                                    )}
                                    isFin={false}
                                    onClick={() => onClick(room.roomId)}
                                />
                            ))}
                    </div>

                    <div className='flex flex-col'>
                        <TagItem text='종료' color='line' />
                        {inactiveRooms &&
                            inactiveRooms.map((room) => (
                                <ChatRoomItem
                                    key={room.roomId}
                                    partnerName={room.debtorName}
                                    lastMessage={room.lastMessage}
                                    unreadCount={room.unreadCount}
                                    lastMessageTime={convertTime(
                                        room.lastMessageTime,
                                    )}
                                    isFin={true}
                                    onClick={() => onClick(room.roomId)}
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
