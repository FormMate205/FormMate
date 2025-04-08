interface ChatProfileProps {
    isBot: boolean;
    name: string;
}

const ChatProfile = ({ isBot, name }: ChatProfileProps) => {
    return (
        <div className='flex items-center gap-3'>
            {isBot ? (
                <img src='/assets/images/chatbot.png' width={28} />
            ) : (
                <img src='/assets/images/avatar.png' width={24} />
            )}
            <p className='text-lg font-medium'>{name}</p>
        </div>
    );
};

export default ChatProfile;
