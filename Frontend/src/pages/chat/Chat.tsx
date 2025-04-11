import { useLocation, useParams } from 'react-router-dom';
import { useGetContractDetail } from '@/entities/contract/api/ContractAPI';
import ContractDocument from '@/entities/contract/ui/ContractDocument';
import { useUserStore } from '@/entities/user/model/userStore';
import showName from '@/features/chat/lib/showName';
import { useConnectWs } from '@/features/chat/model/useConnectWs';
import ChatBox from '@/features/chat/ui/ChatBox';
import ChatSystem from '@/features/chat/ui/ChatSystem';
import { Icons } from '@/shared';
import { useContractPdfExport } from '@/shared/model/useContractPdfExport';
import { CommonModal, Header } from '@/widgets';
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

    // 계약서 상세보기
    const { data } = useGetContractDetail(roomId!);
    const { exportContract } = useContractPdfExport();

    return (
        <div className='flex flex-col items-center justify-between w-full h-screen px-4 py-2 bg-line-50'>
            <Header title='채팅' />

            {/* 계약서 팝업 */}
            <div className='flex justify-end w-full'>
                <CommonModal
                    triggerChildren={
                        <div
                            className='flex items-center justify-center bg-white rounded-full shadow-xs h-9 w-9'
                            aria-label='계약서 보기'
                        >
                            <Icons
                                name='docs'
                                className='fill-line-700'
                                width={20}
                            />
                        </div>
                    }
                    children={<ContractDocument contract={data!} />}
                    confirmText='pdf 다운로드'
                    onClick={() => exportContract(data!)}
                />
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
                onSend={sendMessage}
            />
        </div>
    );
};

export default Chat;
