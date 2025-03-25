import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/entities/types/chat';
import { FormDraftRequest } from '@/entities/types/form';
import { BotQuestion } from '@/features/chatBot/type';
import { chatBotQuestions } from '@/features/chatBot/utils/chatBotQuestions';
import { BOT_ID } from '@/shared/constant';
import { formatDate } from '@/shared/utils/formatDate';

interface UseChatBotParams {
    userId: string;
    initialReceiverId?: string;
}

export const useChatBot = ({
    userId,
    initialReceiverId = '',
}: UseChatBotParams) => {
    // 채팅 내역
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    // 질문 상태
    const [currentQuestionId, setCurrentQuestionId] = useState<string>('role');
    const [currentQuestion, setCurrentQuestion] = useState<BotQuestion | null>(
        null,
    );
    const [inputEnabled, setInputEnabled] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [showDivider, setShowDivider] = useState<boolean>(false);
    const messageIdCounterRef = useRef('1');

    // FormDraftRequest 상태 관리
    const [formDraft, setFormDraft] = useState<FormDraftRequest>({
        receiverId: initialReceiverId,
        creditorId: '',
        debtorId: '',
        maturityDate: '',
        loanAmount: '',
        repaymentMethod: '원금상환',
        repaymentDay: '0',
        interestRate: '',
        earlyRepaymentFeeRate: '',
        overdueInterestRate: '',
        overdueLimit: '',
        specialTermIndexes: [],
    });

    // 초기 질문 표시
    useEffect(() => {
        if (chatHistory.length === 0) {
            const startQuestion = chatBotQuestions['role'];
            setCurrentQuestion(startQuestion);

            const firstMessage: ChatMessage = {
                id: '1',
                writerId: BOT_ID,
                content: startQuestion.question,
            };

            setChatHistory([firstMessage]);
        }
    }, []);

    // 현재 질문 ID가 변경될 때 현재 질문 업데이트
    useEffect(() => {
        if (currentQuestionId) {
            const question = chatBotQuestions[currentQuestionId];
            setCurrentQuestion(question);

            if (question) {
                // 새 질문 메시지 추가
                setTimeout(() => {
                    messageIdCounterRef.current += 1;
                    const newMessage: ChatMessage = {
                        id: messageIdCounterRef.current.toString(),
                        writerId: BOT_ID,
                        content: question.question,
                    };

                    setChatHistory((prev) => [...prev, newMessage]);

                    // 입력 유형에 따라 입력창 활성화/비활성화
                    setInputEnabled(
                        !['role', 'boolean', 'method', 'specialTerms'].includes(
                            question.type,
                        ),
                    );

                    // 분할 상환 방법 질문이나 특약사항일 때 구분선 표시
                    setShowDivider(
                        question.id === 'repaymentMethod' ||
                            question.id === 'specialTerms',
                    );
                }, 500);
            }
        }
    }, [currentQuestionId]);

    // 메시지 전송 함수
    const sendMessage = (content: string) => {
        if (!content.trim()) return;

        // 사용자 메시지 추가
        messageIdCounterRef.current += 1;
        const newMessage: ChatMessage = {
            id: messageIdCounterRef.current.toString(),
            writerId: userId,
            content,
        };

        setChatHistory((prev) => [...prev, newMessage]);
        setInputValue('');

        // 현재 질문에 대한 응답 처리
        if (currentQuestion) {
            updateFormDraft(currentQuestion.id, content);

            // 다음 질문 결정
            if (currentQuestion.next) {
                const nextQuestionId =
                    typeof currentQuestion.next === 'function'
                        ? currentQuestion.next(content)
                        : currentQuestion.next;

                if (nextQuestionId) {
                    setCurrentQuestionId(nextQuestionId);
                }
            } else if (currentQuestion.id === 'complete' && content === '네') {
                // 계약서 생성 처리
                createContract();
            }
        }
    };

    // FormDraft 업데이트 함수
    const updateFormDraft = (questionId: string, answer: string) => {
        setFormDraft((prev) => {
            const updated = { ...prev };

            switch (questionId) {
                case 'role':
                    if (answer === '채권자') {
                        updated.creditorId = userId;
                        updated.debtorId = updated.receiverId;
                    } else {
                        updated.debtorId = userId;
                        updated.creditorId = updated.receiverId;
                    }
                    break;

                case 'loanAmount':
                    updated.loanAmount = answer;
                    break;

                case 'maturityDate':
                    updated.maturityDate = formatDate(answer)!;
                    break;

                case 'interestRate':
                    updated.interestRate = answer;
                    break;

                case 'overdueInterestRate':
                    updated.overdueInterestRate = answer;
                    break;

                case 'repayment':
                    if (answer !== '네') {
                        updated.repaymentMethod = '원금상환';
                        updated.repaymentDay = '0';
                    }
                    break;

                case 'repaymentDay':
                    updated.repaymentDay = answer;
                    break;

                case 'earlyRepaymentFeeRate':
                    updated.earlyRepaymentFeeRate = answer;
                    break;

                case 'overdueLimit':
                    updated.overdueLimit = answer;
                    break;
            }

            return updated;
        });
    };

    // 역할 선택 처리
    const handleRoleSelect = (type: 'creditor' | 'debtor') => {
        const roleText = type === 'creditor' ? '채권자' : '채무자';
        sendMessage(roleText);
    };

    // 상환 방법 선택 처리
    const handleRepaymentMethodSelect = (method: string) => {
        // 폼 데이터에 저장 및 메시지 전송
        sendMessage(method);

        // 실제 API 전송용 value 값 별도 저장
        setFormDraft((prev) => ({
            ...prev,
            repaymentMethod:
                method === '원리금균등상환' ? '원리금균등상환' : '원금균등상환',
        }));
    };

    // 특약사항 선택 완료 처리
    const handleSpecialTermsComplete = (selectedTerms: string[]) => {
        if (currentQuestion) {
            // FormDraftRequest에 특약 인덱스 저장
            setFormDraft((prev) => ({
                ...prev,
                specialTermIndexes: selectedTerms,
            }));

            // 다음 질문으로 이동
            if (currentQuestion.next) {
                const nextQuestionId = currentQuestion.next;

                if (nextQuestionId) {
                    setCurrentQuestionId(nextQuestionId);
                }
            }
        }
    };

    // receiverId 설정 함수
    const setReceiverId = (receiverId: string) => {
        setFormDraft((prev) => ({
            ...prev,
            receiverId,
        }));
    };

    // 계약서 생성 처리
    const createContract = async () => {
        try {
            console.log('계약서 생성 요청:', formDraft);

            const completeMessage: ChatMessage = {
                id: String(chatHistory.length + 1),
                writerId: BOT_ID,
                content: '계약서가 성공적으로 생성되었습니다!',
            };

            setChatHistory((prev) => [...prev, completeMessage]);
        } catch (error) {
            console.error('계약서 생성 오류:', error);

            const errorMessage: ChatMessage = {
                id: String(chatHistory.length + 1),
                writerId: BOT_ID,
                content:
                    '계약서 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
            };

            setChatHistory((prev) => [...prev, errorMessage]);
            throw error;
        }
    };

    return {
        // 상태
        chatHistory,
        currentQuestion,
        inputEnabled,
        inputValue,
        showDivider,
        formDraft,

        // 액션
        setInputValue,
        sendMessage,
        handleRoleSelect,
        handleRepaymentMethodSelect,
        handleSpecialTermsComplete,
        setReceiverId,
        createContract,
    };
};
