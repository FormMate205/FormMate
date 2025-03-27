interface ChatContentProps {
    isMe: boolean;
    content: string;
}

const ChatContent = ({ isMe, content }: ChatContentProps) => {
    return (
        <div
            className={`w-fit max-w-[280px] rounded-2xl px-3 py-2 break-words whitespace-pre-wrap ${
                isMe ? 'bg-line-100' : 'bg-white'
            }`}
        >
            {content}
        </div>
    );
};

export default ChatContent;
