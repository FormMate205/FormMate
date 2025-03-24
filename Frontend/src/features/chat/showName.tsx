interface ChatMessage {
    id: string;
    writerId: string;
    content: string;
}

const showName = (chatHistory: ChatMessage[]) => {
    return (index: number): boolean => {
        // 첫 번째 메시지이거나 이전 메시지와 작성자가 다르면 이름 표시
        if (index === 0) return true;

        const currentChat = chatHistory[index];
        const prevChat = chatHistory[index - 1];

        return currentChat.writerId !== prevChat.writerId;
    };
};

export default showName;
