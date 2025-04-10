import { FormDraftRequest } from '@/entities/formDraft/model/types';
import { formatDate } from '@/shared/lib/formatDate';

// 채권자, 채무자 설정
export const setRoleIds = (
    formDraft: FormDraftRequest,
    userId: string,
    role: '채권자' | '채무자',
): FormDraftRequest => {
    if (role === '채권자') {
        return {
            ...formDraft,
            creditorId: userId,
            debtorId: formDraft.receiverId,
        };
    } else {
        return {
            ...formDraft,
            debtorId: userId,
            creditorId: formDraft.receiverId,
        };
    }
};

// 분할 납부 설정
export const setRepaymentInfo = (
    formDraft: FormDraftRequest,
    wantsRepayment: boolean,
    repaymentMethod?: string,
    repaymentDay?: string,
): FormDraftRequest => {
    if (!wantsRepayment) {
        return {
            ...formDraft,
            repaymentMethod: '원금상환',
            repaymentDay: '0',
        };
    }

    return {
        ...formDraft,
        repaymentMethod: repaymentMethod || formDraft.repaymentMethod,
        repaymentDay: repaymentDay || formDraft.repaymentDay,
    };
};

// 특약사항 인덱스 설정
export const setSpecialTerms = (
    formDraft: FormDraftRequest,
    selectedTerms: string[],
): FormDraftRequest => {
    return {
        ...formDraft,
        specialTermIndexes: selectedTerms,
    };
};

// FormDraftRequest에 필드 업데이트 함수
export const updateFormDraftField = <K extends keyof FormDraftRequest>(
    formDraft: FormDraftRequest,
    field: K,
    value: FormDraftRequest[K],
): FormDraftRequest => {
    return {
        ...formDraft,
        [field]: value,
    };
};

// 모든 질문에 대한 응답으로 FormDraftRequest 생성
export const createFormDraftFromAnswers = (
    userId: string,
    receiverId: string,
    answers: Record<string, string>,
): FormDraftRequest => {
    const formDraft: FormDraftRequest = {
        receiverId,
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
    };

    // 역할 설정
    if (answers.role === '채권자') {
        formDraft.creditorId = userId;
        formDraft.debtorId = receiverId;
    } else {
        formDraft.debtorId = userId;
        formDraft.creditorId = receiverId;
    }

    // 기본 필드 설정
    if (answers.loanAmount) formDraft.loanAmount = answers.loanAmount;
    if (answers.maturityDate)
        formDraft.maturityDate = formatDate(answers.maturityDate)!;
    if (answers.interestRate) formDraft.interestRate = answers.interestRate;
    if (answers.overdueInterestRate)
        formDraft.overdueInterestRate = answers.overdueInterestRate;
    if (answers.earlyRepaymentFeeRate)
        formDraft.earlyRepaymentFeeRate = answers.earlyRepaymentFeeRate;
    if (answers.overdueLimit) formDraft.overdueLimit = answers.overdueLimit;

    // 분할 납부 관련 설정
    if (answers.repayment === '네') {
        if (answers.repaymentMethod) {
            formDraft.repaymentMethod = answers.repaymentMethod;
        }
        if (answers.repaymentDay) {
            formDraft.repaymentDay = answers.repaymentDay;
        }
    }

    // 특약사항 설정 (문자열 배열을 가정)
    if (answers.specialTerms) {
        const specialTerms = JSON.parse(answers.specialTerms);
        if (Array.isArray(specialTerms)) {
            formDraft.specialTermIndexes = specialTerms;
        }
    }

    return formDraft;
};
