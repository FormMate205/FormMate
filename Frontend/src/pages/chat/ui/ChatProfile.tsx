import { Icons } from '@/shared';

interface ChatProfileProps {
    isBot?: boolean;
    name: string;
}

const ChatProfile = ({ isBot = false, name }: ChatProfileProps) => {
    return (
        <div className='flex items-start justify-center gap-3'>
            {isBot ? (
                <Icons name='chatbot' size={24} />
            ) : (
                <img src='/public/assets/images/avatar.png' width={24} />
            )}
            <p className='text-lg font-medium'>{name}</p>
        </div>
    );
};

export default ChatProfile;
