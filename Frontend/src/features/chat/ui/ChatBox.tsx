import ChatContent from '@/entities/chat/ui/ChatContent';
import ChatProfile from '@/entities/chat/ui/ChatProfile';
import { useUserStore } from '@/entities/user/model/userStore';

interface ChatBoxProps {
    writerId: string;
    name?: string;
    content: string;
}

const ChatBox = ({ writerId, name, content }: ChatBoxProps) => {
    const { user } = useUserStore();
    const userId = user?.id;

    return (
        <div
            className={`flex w-full flex-col gap-2 ${writerId == userId ? 'items-end' : 'items-start'}`}
        >
            {/* 상대방 프로필만 보이게 */}
            {name && <ChatProfile isBot={writerId == '0'} name={name} />}
            <ChatContent isMe={writerId == userId} content={content} />
        </div>
    );
};

export default ChatBox;
