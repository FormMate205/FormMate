import { ChangeEvent, useState } from 'react';
import getName from '@/features/chat/model/getName';
import showName from '@/features/chat/model/showName';
import { Header } from '@/widgets';
import ChatBox from '../../entities/chat/ui/ChatBox';
import ChatInput from '../../entities/chat/ui/ChatInput';

const Chat = () => {
    const userId = '1';
    const dummy = {
        formId: '1',
        writer: [
            {
                id: '1',
                name: '강지은',
            },
            {
                id: '2',
                name: '윤이영',
            },
        ],
        history: [
            {
                id: '1',
                writerId: '1',
                content: '안녕하세요',
            },
            {
                id: '2',
                writerId: '2',
                content: '하이루',
            },
            {
                id: '3',
                writerId: '2',
                content: 'ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
            },
        ],
    };

    const [value, setValue] = useState('');
    const [chatting, setChatting] = useState(dummy);

    const getNameFunc = getName(chatting.writer);
    const showNameFunc = showName(chatting.history);

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const onClick = () => {
        console.log('채팅 보내기: ', value);
        if (value.trim()) {
            const newChat = {
                id: String(chatting.history.length + 1),
                writerId: userId,
                content: value,
            };

            setChatting((prev) => ({
                ...prev,
                history: [...prev.history, newChat],
            }));
        }
        setValue('');
    };

    return (
        <div className='bg-line-50 flex h-screen w-full flex-col items-center justify-between px-4 py-2'>
            <Header title='계약 생성' />

            {/* 채팅 내용 */}
            <div className='my-1 flex w-full flex-1 flex-col gap-2 overflow-y-auto'>
                {chatting.history.length > 0 &&
                    chatting.history.map((chat, index) => {
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
            </div>

            {/* 채팅 입력창 */}
            <ChatInput
                isActive={value.trim().length > 0}
                value={value}
                onChange={onChange}
                onClick={onClick}
            />
        </div>
    );
};

export default Chat;
