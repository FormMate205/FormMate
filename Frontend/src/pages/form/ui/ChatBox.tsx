interface ChatBoxProps {
    isMe?: boolean;
    content: string;
}

const ChatBox = ({ isMe = true, content }: ChatBoxProps) => {
    return (
        <div
            className={`max-w-[280px] rounded-2xl px-3 py-2 ${isMe} ? 'bg-white' : 'bg-line-100`}
        >
            {content}
        </div>
    );
};

export default ChatBox;
