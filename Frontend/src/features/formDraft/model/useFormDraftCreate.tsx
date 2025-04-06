import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '@/entities/chat/model/types';
import { BOT_ID } from '@/entities/formDraft/config/constant';
import {
    formDraftQuestions,
    specialTermsInfo,
} from '@/entities/formDraft/config/formDraftQuestions';
import { FormDraftRequest } from '@/entities/formDraft/model/types';
import { formatCurrency } from '@/shared/model/formatCurrency';
import { formatDate } from '@/shared/model/formatDate';
import { usePostFormDraft } from '../api/formDraftAPI';
import { validateUserAnswer } from './answerValid';
import { Question } from './types';

interface UseFormDraftCreateProps {
    userId: string;
    userName: string;
    initialReceiverId?: string;
}

export const useFormDraftCreate = ({
    userId,
    userName,
    initialReceiverId = '',
}: UseFormDraftCreateProps) => {
    // 계약서 생성 API
    const { data, mutate } = usePostFormDraft();

    // 계약 생성 완료 상태
    const [isContractCreated, setIsContractCreated] = useState(false);

    // 채팅 내역
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    // 질문 상태
    const [currentQuestionId, setCurrentQuestionId] = useState<string>('role');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
        null,
    );
    const [inputEnabled, setInputEnabled] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const messageIdCounterRef = useRef('1');

    // 특약 조항 관련 상태
    const [currentTermIndex, setCurrentTermIndex] = useState(0);
    const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
    const [isLastTermProcessed, setIsLastTermProcessed] = useState(false);

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

    const navigate = useNavigate();

    // 현재 질문 업데이트
    useEffect(() => {
        if (currentQuestionId) {
            const question = formDraftQuestions[currentQuestionId];
            setCurrentQuestion(question);

            if (question) {
                // 새 질문 메시지 추가
                setTimeout(() => {
                    messageIdCounterRef.current += 1;
                    const newMessage: ChatMessage = {
                        id: messageIdCounterRef.current.toString(),
                        writerId: BOT_ID,
                        writerName: '페이봇',
                        content: question.question,
                    };

                    setChatHistory((prev) => [...prev, newMessage]);

                    // 조건이 있는 경우 별도 메시지로 추가
                    if (question.condition && question.condition.length > 0) {
                        setTimeout(() => {
                            messageIdCounterRef.current += 1;
                            const conditionMessage: ChatMessage = {
                                id: messageIdCounterRef.current.toString(),
                                writerId: BOT_ID,
                                writerName: '페이봇',
                                content: question.condition!.join('\n'),
                            };
                            setChatHistory((prev) => [
                                ...prev,
                                conditionMessage,
                            ]);
                        }, 300);
                    }

                    // 입력창 비활성화 타입
                    setInputEnabled(
                        ![
                            'role',
                            'boolean',
                            'method',
                            'date',
                            'specialTerms',
                        ].includes(question.type),
                    );
                }, 500);
            }
        }
    }, [currentQuestionId]);

    // 특약 인덱스 업데이트
    useEffect(() => {
        // 모든 특약 처리가 완료된 후
        if (isLastTermProcessed) {
            setFormDraft((prev) => ({
                ...prev,
                specialTermIndexes: selectedTerms,
            }));

            // 마지막 질문으로 이동
            setTimeout(() => {
                if (currentQuestion && currentQuestion.next) {
                    const nextQuestionId = currentQuestion.next;
                    if (nextQuestionId) {
                        setCurrentQuestionId(nextQuestionId);
                    }
                }
            }, 500);

            // 플래그 초기화
            setIsLastTermProcessed(false);
        }
    }, [selectedTerms, isLastTermProcessed, currentQuestion]);

    // 메시지 전송 함수
    const sendMessage = (content: string) => {
        if (!content.trim()) {
            // 챗봇 메시지 추가
            messageIdCounterRef.current += 1;
            const newMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: BOT_ID,
                writerName: '페이봇',
                content: '값을 입력해주세요.',
            };

            setChatHistory((prev) => [...prev, newMessage]);
            return;
        }

        const { isValid, errorMessage } = validateUserAnswer(
            formDraft,
            currentQuestion,
            content,
        );

        if (!isValid) {
            // 챗봇 메시지 추가
            messageIdCounterRef.current += 1;
            const newMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: BOT_ID,
                writerName: '페이봇',
                content: errorMessage || '다시 입력해주세요.',
            };

            setChatHistory((prev) => [...prev, newMessage]);
            return;
        }

        // 사용자 메시지 추가
        messageIdCounterRef.current += 1;
        if (currentQuestion?.id === 'loanAmount') {
            // 대출 금액은 원화로 표시
            const newMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: userId,
                writerName: userName,
                content: formatCurrency(content),
            };
            setChatHistory((prev) => [...prev, newMessage]);
        } else {
            const newMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: userId,
                writerName: userName,
                content,
            };
            setChatHistory((prev) => [...prev, newMessage]);
        }

        setInputValue('');

        // 현재 질문에 대한 응답 처리
        if (currentQuestion) {
            updateFormDraft(currentQuestion.id, content);

            // 마지막 질문이라면
            if (currentQuestion.id === 'complete') {
                if (content === '네') {
                    createContract();
                } else {
                    messageIdCounterRef.current += 1;
                    const finalMessage: ChatMessage = {
                        id: messageIdCounterRef.current.toString(),
                        writerId: BOT_ID,
                        writerName: '페이봇',
                        content: '계약서 생성을 취소했습니다.',
                    };
                    setChatHistory((prev) => [...prev, finalMessage]);
                }

                setCurrentQuestion(null);
            } else if (currentQuestion.next) {
                // 다음 질문 결정
                const nextQuestionId =
                    typeof currentQuestion.next === 'function'
                        ? currentQuestion.next(content)
                        : currentQuestion.next;

                if (nextQuestionId) {
                    setCurrentQuestionId(nextQuestionId);
                }
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
        sendMessage(method);

        setFormDraft((prev) => ({
            ...prev,
            repaymentMethod:
                method === '원리금균등상환' ? '원리금균등상환' : '원금균등상환',
        }));
    };

    // 특약사항 선택 처리
    const handleSpecialTermSelect = (termId: string, isSelected: boolean) => {
        const response = isSelected ? '네' : '아니오';

        messageIdCounterRef.current += 1;
        const userMessage: ChatMessage = {
            id: messageIdCounterRef.current.toString(),
            writerId: userId,
            writerName: userName,
            content: response,
        };
        setChatHistory((prev) => [...prev, userMessage]);

        // 선택된 특약 업데이트
        if (isSelected) {
            setSelectedTerms((prev) => [...prev, termId]);
        }

        // 다음 특약조항으로 이동
        const nextTermIndex = currentTermIndex + 1;

        if (nextTermIndex < specialTermsInfo.length) {
            setCurrentTermIndex(nextTermIndex);
        } else {
            // 마지막 특약 처리 완료 플래그 설정
            setIsLastTermProcessed(true);
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
    useEffect(() => {
        if (data) {
            messageIdCounterRef.current += 1;
            const completeMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: BOT_ID,
                writerName: '페이봇',
                content: '계약서가 성공적으로 생성되었습니다!',
            };

            setChatHistory((prev) => [...prev, completeMessage]);

            // 계약서 생성 종료
            setCurrentQuestion(null);
            setInputEnabled(false);
            setIsContractCreated(true);

            console.log('계약서 생성 완료', data);
            const timer = setTimeout(() => {
                navigate(`/chat/${data?.formId}`, {
                    state: {
                        isFin: false,
                        creditorId: data.creditorId,
                    },
                });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [data, navigate]);

    const createContract = async () => {
        try {
            messageIdCounterRef.current += 1;
            const loadingMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: BOT_ID,
                writerName: '페이봇',
                content: '계약서를 생성하고 있습니다. 잠시만 기다려주세요.',
            };

            setChatHistory((prev) => [...prev, loadingMessage]);

            // API 호출
            mutate(formDraft);
        } catch (error) {
            console.error('계약서 생성 오류:', error);

            messageIdCounterRef.current += 1;
            const errorMessage: ChatMessage = {
                id: messageIdCounterRef.current.toString(),
                writerId: BOT_ID,
                writerName: '페이봇',
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
        formDraft,
        currentTermIndex,
        isContractCreated,

        // 액션
        setInputValue,
        sendMessage,
        handleRoleSelect,
        handleRepaymentMethodSelect,
        handleSpecialTermSelect,
        setReceiverId,
        createContract,
    };
};
