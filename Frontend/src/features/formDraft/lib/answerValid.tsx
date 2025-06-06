import { FormDraftRequest, Question } from '@/entities/formDraft/model/types';

// 범위 검증
export const validateRange = (
    value: string,
    min: string,
    max?: string,
): boolean => {
    const range = parseFloat(value);
    if (max === undefined) return !isNaN(range) && range >= Number(min);

    return !isNaN(range) && range >= Number(min) && range <= Number(max);
};

// 사용자 응답 유효성 검사 함수
export const validateUserAnswer = (
    formDraft: FormDraftRequest,
    question: Question | null,
    answer: string,
): { isValid: boolean; errorMessage?: string } => {
    if (question == null)
        return {
            isValid: true,
        };

    // 정규식 검증
    if (question.type === 'number' || question.type === 'date') {
        if (question.validation?.regex) {
            const regex = new RegExp(question.validation.regex);

            if (!regex.test(answer)) {
                return {
                    isValid: false,
                    errorMessage: question.validation.errorMessage,
                };
            }
        }

        // 범위 검증
        if (question.validation?.min !== undefined) {
            if (
                !validateRange(
                    answer,
                    question.validation.min,
                    question.validation.max,
                )
            ) {
                return {
                    isValid: false,
                    errorMessage: question.validation.errorMessage,
                };
            }
        }
    }

    if (question.id === 'overdueInterestRate') {
        if (Number(formDraft.interestRate) + Number(answer) > 20) {
            return {
                isValid: false,
                errorMessage:
                    '이자율 + 연체 이자율 + 중도상환수수료율은 20%를 초과할 수 없습니다.',
            };
        }
    }

    if (question.id === 'earlyRepaymentFeeRate') {
        if (
            Number(formDraft.interestRate) +
                Number(formDraft.overdueInterestRate) +
                Number(answer) >
            20
        ) {
            return {
                isValid: false,
                errorMessage:
                    '이자율 + 연체 이자율 + 중도상환수수료율은 20%를 초과할 수 없습니다.',
            };
        }
    }

    return { isValid: true };
};
