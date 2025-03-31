import { useParams } from 'react-router-dom';
import { useConnectWs } from '@/entities/chat/model/useConnectWs';
import showName from '@/features/chat/model/showName';
import ChatBox from '@/features/chat/ui/ChatBox';
import { Header } from '@/widgets';
import ChatInput from '../../entities/chat/ui/ChatInput';

const Chat = () => {
    const userId = '1';
    const userName = '강지은';
    const { roomId } = useParams();

    const {
        chatHistory,
        message,
        setMessage,
        sendMessage,
        isConnected,
        scrollRef,
    } = useConnectWs({ userId, userName, roomId });

    const displayProfile = showName(chatHistory);

    return (
        <div className='bg-line-50 flex h-screen w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='계약 생성' />

            {/* 채팅 내용 */}
            <div
                ref={scrollRef}
                className='my-1 flex w-full flex-1 flex-col gap-2 overflow-y-auto'
            >
                {chatHistory.length > 0 &&
                    chatHistory.map((chat, index) => {
                        return (
                            <ChatBox
                                key={chat.id}
                                writerId={chat.writerId}
                                content={chat.content}
                                name={
                                    chat.writerId !== userId &&
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
                <div className='w-full bg-red-100 p-2 text-center text-red-600'>
                    연결이 끊어졌습니다. 새로고침을 시도해주세요.
                </div>
            )}

            {/* 채팅 입력창 */}
            <ChatInput
                isActive={message.trim().length > 0}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onClick={sendMessage}
            />
        </div>
    );
};

export default Chat;
