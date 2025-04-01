import ChatCount from '@/entities/chat/ui/ChatCount';
import { Icons } from '@/shared';

interface ChatRoomItemProps {
    partnerName: string;
    lastMessage: string;
    unreadCount: string;
    lastTime: string;
    isFin: boolean;
}

const ChatRoomItem = ({
    partnerName,
    lastMessage,
    unreadCount,
    lastTime,
    isFin,
}: ChatRoomItemProps) => {
    return (
        <button className='flex w-full justify-between'>
            <div className='flex gap-5'>
                <Icons
                    name='chat'
                    className={`${isFin ? 'fill-line-300' : 'fill-primary-500'}`}
                />
                <div className='flex flex-col items-start justify-between'>
                    <p
                        className={`${isFin ? 'text-line-700' : 'text-black'} font-medium`}
                    >
                        {partnerName}
                    </p>
                    <p className='text-line-700'>{lastMessage}</p>
                </div>
            </div>

            <div className='flex flex-col items-end justify-between'>
                <p className='text-line-700 text-sm'>{lastTime}</p>
                <ChatCount count={unreadCount} />
            </div>
        </button>
    );
};

export default ChatRoomItem;
