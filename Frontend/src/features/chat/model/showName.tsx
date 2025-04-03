import { ChatMessage } from '@/entities/chat/model/types';

const showName = (chatHistory: ChatMessage[]) => {
    return (index: number): boolean => {
        // 마지막 메시지이거나 다음 메시지와 작성자가 다르면 이름 표시
        if (index === chatHistory.length - 1) return true;

        const currentChat = chatHistory[index];
        const nextChat = chatHistory[index + 1];

        return currentChat.writerId !== nextChat.writerId;
    };
};

export default showName;
