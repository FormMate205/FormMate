import { useLocation, useParams } from 'react-router-dom';
import FormModal from '@/entities/chat/ui/FormModal';
import { useUserStore } from '@/entities/user/model/userStore';
import showName from '@/features/chat/model/showName';
import { useConnectWs } from '@/features/chat/model/useConnectWs';
import ChatBox from '@/features/chat/ui/ChatBox';
import ChatSystem from '@/features/chat/ui/ChatSystem';
import { Header } from '@/widgets';
import ChatInput from '../../entities/chat/ui/ChatInput';

const Chat = () => {
    const location = useLocation();
    const { isFin } = location.state;

    const { user } = useUserStore();
    const { roomId } = useParams();

    const {
        messages,
        message,
        setMessage,
        sendMessage,
        isConnected,
        scrollRef,
    } = useConnectWs({ user, roomId });

    const displayProfile = showName(messages);
    return (
        <div className='bg-line-50 flex h-screen w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='채팅' />

            {/* 계약서 팝업 */}
            <div className='flex w-full justify-end'>
                <FormModal formId={roomId!} />
            </div>

            {/* 채팅 내용 */}
            <div
                ref={scrollRef}
                className='scrollbar-none my-1 flex w-full flex-1 flex-col-reverse gap-2 overflow-y-auto'
            >
                {messages.map((chat, index) => {
                    return chat.messageType == 'CONTRACT_SHARED' ||
                        chat.messageType == 'SIGNATURE_REQUEST_CONTRACT' ||
                        chat.messageType == 'SIGNATURE_REQUEST_TERMINATION' ? (
                        <ChatSystem
                            key={chat.id}
                            formId={chat.formId!}
                            children={chat.content}
                            type={chat.messageType}
                            signId={chat.targetUserId}
                        />
                    ) : (
                        <ChatBox
                            key={chat.id}
                            writerId={chat.writerId}
                            content={chat.content}
                            name={
                                chat.writerId !== user?.id &&
                                displayProfile(index)
                                    ? chat.writerName
                                    : undefined
                            }
                        />
                    );
                })}
            </div>

            {/* 채팅 입력창 */}
            <ChatInput
                isActive={isConnected && !isFin}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onClick={sendMessage}
            />
        </div>
    );
};

export default Chat;
