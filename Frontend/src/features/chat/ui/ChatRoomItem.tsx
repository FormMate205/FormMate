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
            <div className='flex min-w-0 flex-1 gap-5 overflow-hidden pl-3'>
                <Icons
                    name='chat'
                    className={`${isFin ? 'fill-line-300' : 'fill-primary-500'} mt-[2px] flex-shrink-0`}
                />
                <div className='flex min-w-0 flex-col gap-1 overflow-hidden text-left'>
                    <p
                        className={`${isFin ? 'text-line-700' : 'text-black'} w-full font-medium`}
                    >
                        {partnerName}
                    </p>
                    <p className='text-line-700 w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                        {lastMessage}
                    </p>
                </div>
            </div>

            <div className='ml-4 flex flex-shrink-0 flex-col items-end gap-2 pr-4'>
                <p className='text-line-700 text-sm whitespace-nowrap'>
                    {lastMessageTime}
                </p>
                {Number(unreadCount) > 0 && (
                    <div className='bg-primary-100 text-primary-500 flex items-center justify-center rounded-lg px-2 py-[2px] text-sm font-medium'>
                        {unreadCount}
                    </div>
                )}
            </div>
        </button>
    );
};

export default ChatRoomItem;
