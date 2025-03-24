interface ChatBoxProps {
    isMe?: boolean;
    content: string;
    userName?: string;
}

const ChatBox = ({ isMe = true, content, userName }: ChatBoxProps) => {
    return (
        <div
            className={`flex w-full flex-col ${isMe ? 'items-end' : 'items-start'}`}
        >
            {!isMe && userName && (
                <span className='py-2 pl-2 text-sm font-medium'>
                    {userName}
                </span>
            )}

            <div
                className={`max-w-[280px] rounded-2xl px-3 py-2 break-words ${
                    isMe ? 'bg-line-100' : 'bg-white'
                }`}
            >
                {content}
            </div>
        </div>
    );
};

export default ChatBox;
