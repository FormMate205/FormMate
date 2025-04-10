import { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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

    useEffect(() => {
        const handlePopState = () => {
            navigate('/chat');
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className='bg-line-50 flex h-screen w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='채팅' />

            {/* 계약서 팝업 */}
            <div className='flex w-full justify-end'>
                <CommonModal
                    triggerChildren={
                        <div
                            className='flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs'
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
