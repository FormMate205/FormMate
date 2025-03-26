import { ChangeEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarButton } from '@/components/ui/calendarButton';
import { getName, showName } from '@/features';
import { useChatBot } from '@/features/chatBot/useChatBot';
import { BOT_ID } from '@/shared/constant';
import { DatePicker } from '@/shared/ui/DatePicker';
import { Header } from '@/widgets';
import ChatBox from './ui/ChatBox';
import ChatInput from './ui/ChatInput';
import NotiContainer from './ui/NotiContainer';
import RepaymentMethodSelector from './ui/RepaymentMethodSelector';
import RoleSelector from './ui/RoleSelector';
import SpecialTermsSelector from './ui/SpecialTermSelector';

const FormCreate = () => {
    const userId = '1';
    const receiverId = '2';
    const receiverName = '윤이영';

    const writers = [
        { id: userId, name: '강지은' },
        { id: BOT_ID, name: '페이봇' },
    ];

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
    } = useChatBot({
        userId,
        initialReceiverId: receiverId,
    });

    // 자동 스크롤
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const getNameFunc = getName(writers);
    const showNameFunc = showName(chatHistory);

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const onClick = () => {
        sendMessage(inputValue);
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
                    <div className='flex w-full justify-start gap-2 px-2'>
                        {currentQuestion.options?.map((option) => (
                            <Button
                                key={option.label}
                                variant={`${option.value ? 'choiceFill' : 'choiceEmpty'}`}
                                children={option.label}
                                onClick={() => sendMessage(option.label)}
                            />
                        ))}
                    </div>
                );

            case 'date': {
                return (
                    <div className='flex w-full justify-start px-1'>
                        <DatePicker />
                        <CalendarButton
                            variant={'secondary'}
                            className='확인'
                        />
                    </div>
                );
            }

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
                        currentTermIndex={currentTermIndex}
                        onSelect={handleSpecialTermSelect}
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
            <div
                className='my-1 flex w-full flex-1 flex-col gap-2 overflow-y-auto'
                ref={chatContainerRef}
            >
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

export default FormCreate;
