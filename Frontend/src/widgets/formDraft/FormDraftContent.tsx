import { ChangeEvent, useEffect, useRef } from 'react';
import { BOT_ID } from '@/entities/formDraft/config/constant';
import { FormPartner } from '@/entities/formDraft/model/types';
import { User } from '@/entities/user/model/types';
import showName from '@/features/chat/model/showName';
import ChatBox from '@/features/chat/ui/ChatBox';
import { useFormDraftCreate } from '@/features/formDraft/model/useFormDraftCreate';
import FormSelector from '@/features/formDraft/ui/FormSelector';
import { maskUserName } from '@/shared/lib/maskUserName';
import useNavigationGuard from '@/shared/model/useNavigationGuard';
import { Header } from '@/widgets';
import ChatInput from '../../entities/chat/ui/ChatInput';
import NotiContainer from '../../features/formDraft/ui/NotiContainer';
import NavigationGuardModal from '../modal/NavigationGuardModal';

interface FormDraftContentProps {
    user: User;
    partner: FormPartner;
}

const FormDraftContent = ({ user, partner }: FormDraftContentProps) => {
    const userId = user.id;
    const userName = user.userName;
    const receiverId = partner.userId;
    const receiverName = partner.userName;

    // 챗봇 로직 분리
    const {
        chatHistory,
        currentQuestion,
        inputEnabled,
        inputValue,
        setInputValue,
        sendMessage,
        handleRoleSelect,
        handleRepaymentMethodSelect,
        handleSpecialTermSelect,
        currentTermIndex,
        isContractCreated,
    } = useFormDraftCreate({
        userId,
        userName,
        initialReceiverId: receiverId,
    });

    // 마지막 메시지가 챗봇인지 확인
    const isLastMessageFromBot =
        chatHistory.length > 0 &&
        chatHistory[chatHistory.length - 1].writerId === BOT_ID;

    // 챗봇이 질문을 다 한 후 선택 컴포넌트 렌더링
    const renderSelector = currentQuestion && isLastMessageFromBot;

    // 자동 스크롤
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // 연속채팅 중 첫 채팅만 프로필 표시
    const displayProfile = showName(chatHistory);

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const onClick = () => {
        sendMessage(inputValue);
    };

    // 경로 이탈 감지 모달
    const { showModal, confirmNavigation, cancelNavigation } =
        useNavigationGuard({ shouldBlock: !isContractCreated });

    return (
        <div className='z-10 flex w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='계약 생성' />

            <NotiContainer name={maskUserName(receiverName)} />

            {/* 채팅 내용 */}
            <div
                className='scrollbar-none my-1 flex w-full flex-1 flex-col gap-2 overflow-y-auto'
                ref={chatContainerRef}
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

                {/* 입력 유형에 따른 컴포넌트 렌더링 */}
                {(currentQuestion?.type === 'specialTerms' ||
                    renderSelector) && (
                    <FormSelector
                        currentQuestion={currentQuestion}
                        handleRoleSelect={handleRoleSelect}
                        handleRepaymentMethodSelect={
                            handleRepaymentMethodSelect
                        }
                        handleSpecialTermSelect={handleSpecialTermSelect}
                        sendMessage={sendMessage}
                        currentTermIndex={currentTermIndex}
                    />
                )}
            </div>

            {/* 채팅 입력창 */}
            <ChatInput
                isActive={inputEnabled}
                value={inputValue}
                onChange={onChange}
                onClick={onClick}
            />

            <NavigationGuardModal
                title='계약 생성을 그만두시겠습니까?'
                description='페이지를 벗어나면 지금까지 입력한 모든 내용이 사라집니다.'
                isOpen={showModal}
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
            />
        </div>
    );
};

export default FormDraftContent;
