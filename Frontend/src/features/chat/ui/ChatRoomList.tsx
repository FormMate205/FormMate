import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user/model/userStore';
import { useGetChatRooms } from '@/features/chat/api/chatAPI';
import { convertTime } from '@/features/chat/lib/convertTime';
import ChatRoomItem from '@/features/chat/ui/ChatRoomItem';
import { ChatRoom } from '../model/types';

const ChatRoomList = () => {
    const navigate = useNavigate();

    const { user } = useUserStore();

    // 채팅방 목록 조회
    const { rooms, lastItemRef } = useGetChatRooms({
        page: '0',
        size: '10',
    });

    const onClick = (room: ChatRoom) => {
        navigate(`/chat/${room.formId}`, {
            state: {
                isFin: room.isCompleted,
            },
        });
    };

    return (
        <div className='flex flex-col'>
            {rooms.map((room, index) => (
                <div
                    key={room.formId}
                    ref={index === rooms.length - 1 ? lastItemRef : undefined}
                >
                    <ChatRoomItem
                        partnerName={
                            room.creditorId === user?.id
                                ? room.debtorName
                                : room.creditorName
                        }
                        lastMessage={room.lastMessage}
                        unreadCount={room.unreadCount}
                        lastMessageTime={convertTime(room.lastMessageTime)}
                        isFin={room.isCompleted}
                        onClick={() => onClick(room)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ChatRoomList;
