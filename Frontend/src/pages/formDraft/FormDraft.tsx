import { ChangeEvent, useEffect, useRef } from 'react';
import { BOT_ID } from '@/entities/formDraft/config/constant';
import showName from '@/features/chat/model/showName';
import ChatBox from '@/features/chat/ui/ChatBox';
import { useFormDraftCreate } from '@/features/formDraft/model/useFormDraftCreate';
import FormSelector from '@/features/formDraft/ui/FormSelector';
import { maskUserName } from '@/shared/model/maskUserName';
import useNavigationGuard from '@/shared/model/useNavigationGuard';
import { Header } from '@/widgets';
import NavigationGuardModal from '@/widgets/modal/NavigationGuardModal';
import ChatInput from '../../entities/chat/ui/ChatInput';
import NotiContainer from '../../entities/formDraft/ui/NotiContainer';

const FormDraft = () => {
    const userId = '1';
    const userName = '강지은';
    // 추후에 partner store 값으로 바꿔야함 (지금 바꾸면 값이 없어서 화면에 아무것도 안 보임ㅜㅜ)
    const receiverId = '2';
    const receiverName = '윤이영';

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
        useNavigationGuard();

    return (
        <div className='bg-line-50 relative flex h-screen w-full'>
            {/* 배경 도형 */}
            <div className='aria-hidden absolute top-0 left-0 z-0 h-full w-full overflow-hidden'>
                <div className='bg-primary-50 absolute top-3/4 left-7/8 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80'></div>
                <div className='bg-line-50 absolute top-3/4 left-7/8 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full'></div>
            </div>

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
            </div>

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

export default FormDraft;
