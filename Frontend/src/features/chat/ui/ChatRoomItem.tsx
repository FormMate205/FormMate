import { MouseEvent } from 'react';
import { Icons } from '@/shared';

interface ChatRoomItemProps {
    partnerName: string;
    lastMessage: string;
    unreadCount: string;
    lastMessageTime: string;
    isFin: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatRoomItem = ({
    partnerName,
    lastMessage,
    unreadCount,
    lastMessageTime,
    isFin,
    onClick,
}: ChatRoomItemProps) => {
    return (
        <button
            className={`border-b-line-100 flex w-full justify-between border-b py-4 ${isFin ? 'bg-line-50' : 'bg-white'}`}
            onClick={onClick}
        >
            <div className='flex gap-5 pl-3'>
                <Icons
                    name='chat'
                    className={`${isFin ? 'fill-line-300' : 'fill-primary-500'} mt-[2px]`}
                />
                <div className='flex flex-col items-start justify-between gap-1'>
                    <p
                        className={`${isFin ? 'text-line-700' : 'text-black'} font-medium`}
                    >
                        {partnerName}
                    </p>
                    <p className='text-line-700'>{lastMessage}</p>
                </div>
            </div>

            <div className='flex flex-col items-end justify-between pr-3'>
                <p className='text-line-700 text-sm'>{lastMessageTime}</p>
                <div className='bg-primary-100 text-primary-500 flex items-center justify-center rounded-lg px-2 py-[2px] text-sm font-medium'>
                    {unreadCount}
                </div>
            </div>
        </button>
    );
};

export default ChatRoomItem;
