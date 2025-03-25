import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getName, showName } from '@/features';
import { useChatBot } from '@/features/chatBot/useChatBot';
import { BOT_ID } from '@/shared/constant';
import { Header } from '@/widgets';
import ChatBox from './ui/ChatBox';
import ChatInput from './ui/ChatInput';
import NotiContainer from './ui/NotiContainer';
import RepaymentMethodSelector from './ui/RepaymentMethodSelector';
import RoleSelector from './ui/RoleSelector';
import SpecialTermsSelector from './ui/SpecialTermSelector';

interface ChatBotProps {
    receiverId?: string;
    receiverName?: string;
}

const ChatBot = ({
    receiverId = '',
    receiverName = '윤이영',
}: ChatBotProps) => {
    const userId = '1'; // 현재 사용자 ID
    const writers = [
        { id: userId, name: '강지은' },
        { id: BOT_ID, name: '페이봇' },
    ];

    // 커스텀 훅을 사용하여 챗봇 로직 분리
    const {
        chatHistory,
        currentQuestion,
        inputEnabled,
        inputValue,
        showDivider,
        setInputValue,
        sendMessage,
        handleRoleSelect,
        handleRepaymentMethodSelect,
        handleSpecialTermsComplete,
    } = useChatBot({
        userId,
        initialReceiverId: receiverId,
    });

    const getNameFunc = getName(writers);
    const showNameFunc = showName(chatHistory);

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const onClick = () => {
        sendMessage(inputValue);
    };

    // 구분선 렌더링
    const renderDivider = () => {
        if (!showDivider) return null;

        return (
            <div className='my-4 flex w-full items-center justify-center'>
                <div className='flex items-center'>
                    <div className='h-px w-16 bg-gray-300'></div>
                    <span className='mx-2 text-sm text-gray-500'>
                        추가 정보
                    </span>
                    <div className='h-px w-16 bg-gray-300'></div>
                </div>
            </div>
        );
    };

    // 입력 유형에 따른 컴포넌트 렌더링
    const renderInputByType = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case 'role':
                return (
                    <div className='my-4 flex w-full justify-start gap-4'>
                        <RoleSelector
                            type='creditor'
                            onClick={() => handleRoleSelect('creditor')}
                        />
                        <RoleSelector
                            type='debtor'
                            onClick={() => handleRoleSelect('debtor')}
                        />
                    </div>
                );

            case 'boolean':
                return (
                    <div className='my-4 flex w-full justify-start gap-4'>
                        {currentQuestion.options?.map((option) => (
                            <Button
                                variant={`${option.label === '네' ? 'choiceFill' : 'choiceEmpty'}`}
                                value={option.label}
                                onClick={() => sendMessage(option.label)}
                            />
                        ))}
                    </div>
                );

            case 'method':
                if (currentQuestion.options) {
                    return (
                        <RepaymentMethodSelector
                            options={currentQuestion.options}
                            onSelect={handleRepaymentMethodSelect}
                        />
                    );
                }
                return null;

            case 'specialTerms':
                return (
                    <SpecialTermsSelector
                        onComplete={handleSpecialTermsComplete}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className='bg-line-50 flex h-screen w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='계약 생성' />

            <NotiContainer name={receiverName} />

            {/* 채팅 내용 */}
            <div className='my-1 flex w-full flex-1 flex-col gap-2 overflow-y-auto'>
                {chatHistory.length > 0 &&
                    chatHistory.map((chat, index) => {
                        const isMe = userId === chat.writerId;
                        const showName = !isMe && showNameFunc(index);

                        return (
                            <ChatBox
                                key={chat.id}
                                isMe={isMe}
                                content={chat.content}
                                userName={
                                    showName
                                        ? getNameFunc(chat.writerId)
                                        : undefined
                                }
                            />
                        );
                    })}

                {/* 구분선 표시 */}
                {renderDivider()}

                {/* 입력 유형에 따른 컴포넌트 렌더링 */}
                {renderInputByType()}
            </div>

            {/* 채팅 입력창 */}
            <ChatInput
                isActive={inputEnabled}
                value={inputValue}
                onChange={onChange}
                onClick={onClick}
            />
        </div>
    );
};

export default ChatBot;
