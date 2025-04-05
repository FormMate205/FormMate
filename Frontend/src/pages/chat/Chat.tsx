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
    const { isFin, creditorId } = location.state;

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
        <div className='flex flex-col items-center justify-between w-full h-screen px-4 py-2 bg-line-50'>
            <Header title='채팅' />

            {/* 계약서 팝업 */}
            <div className='flex justify-end w-full'>
                <FormModal formId={roomId!} />
            </div>

            {/* 채팅 내용 */}
            <div
                ref={scrollRef}
                className='flex flex-col-reverse flex-1 w-full gap-2 my-1 overflow-y-auto scrollbar-none'
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
                            creditorId={creditorId}
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

            {/* 연결 상태 표시 */}
            {!isConnected && (
                <div className='w-full p-2 text-center text-red-600 bg-red-100'>
                    연결이 끊어졌습니다. 새로고침을 시도해주세요.
                </div>
            )}

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
