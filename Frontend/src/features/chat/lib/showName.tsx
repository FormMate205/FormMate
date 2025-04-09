import { ChatMessage } from '@/entities/chat/model/types';
import { BOT_ID } from '@/entities/formDraft/config/constant';

const showName = (chatHistory: ChatMessage[], isChatBot?: boolean) => {
    return (index: number): boolean => {
        const currentChat = chatHistory[index];

        // 챗봇 메시지일 경우
        if (isChatBot && currentChat.writerId === BOT_ID) {
            // 첫 메시지일 경우 이름 표시
            if (index === 0) return true;

            // 이전 메시지와 작성자가 다르면 이름 표시
            const prevChat = chatHistory[index - 1];
            return currentChat.writerId !== prevChat.writerId;
        }

        // 마지막 메시지이거나 다음 메시지와 작성자가 다르면 이름 표시
        if (index === chatHistory.length - 1) return true;

        const nextChat = chatHistory[index + 1];
        return currentChat.writerId !== nextChat.writerId;
    };
};

export default showName;
