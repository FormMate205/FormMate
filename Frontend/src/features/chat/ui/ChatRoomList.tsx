import { useNavigate } from 'react-router-dom';
import { useGetChatRooms } from '@/features/chat/api/chatAPI';
import { convertTime } from '@/features/chat/model/convertTime';
import ChatRoomItem from '@/features/chat/ui/ChatRoomItem';

const ChatRoomList = () => {
    const navigate = useNavigate();

    // 채팅방 목록 조회
    const { rooms, lastItemRef } = useGetChatRooms({
        page: '0',
        size: '10',
    });

    const onClick = (roomId: string) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className='flex flex-col'>
            {rooms.map((room, index) => (
                <div
                    key={room.formId}
                    ref={index === rooms.length - 1 ? lastItemRef : undefined}
                >
                    <ChatRoomItem
                        partnerName={room.debtorName}
                        lastMessage={room.lastMessage}
                        unreadCount={room.unreadCount}
                        lastMessageTime={convertTime(room.lastMessageTime)}
                        isFin={room.isCompleted}
                        onClick={() => onClick(room.formId)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ChatRoomList;
