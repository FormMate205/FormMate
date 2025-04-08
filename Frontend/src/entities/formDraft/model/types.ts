import { Contract } from '@/entities/contract/model/types';
import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 계약 상대 정보
export interface FormPartner {
    userId: string;
    userName: string;
    phoneNumber: string;
}

// 입력값 타입
export type InputType =
    | 'role'
    | 'number'
    | 'date'
    | 'boolean'
    | 'method'
    | 'specialTerms';

// 질문에 대한 옵션
export interface Option {
    label: string;
    value: string | boolean;
    description?: string;
}

// 질문 타입 정의
export interface Question {
    id: string;
    question: string;
    type: InputType;
    options?: Option[];
    condition?: string[];
    validation?: {
        regex?: string; // 입력값 유효성 확인
        errorMessage?: string;
        min?: string;
        max?: string;
    };
    next?: string | ((answer: string) => string); // 다음 질문 선택
}

// 계약 초안 request
export type FormDraftRequest = Pick<
    Contract,
    | 'receiverId'
    | 'creditorId'
    | 'debtorId'
    | 'maturityDate'
    | 'loanAmount'
    | 'repaymentMethod'
    | 'repaymentDay'
    | 'interestRate'
    | 'earlyRepaymentFeeRate'
    | 'overdueInterestRate'
    | 'overdueLimit'
> & { specialTermIndexes: string[] };

// 예상 납부 스케줄 requset
export type FormDrafScheduleRequest = Pick<
    Contract,
    | 'loanAmount'
    | 'maturityDate'
    | 'interestRate'
    | 'repaymentDay'
    | 'repaymentMethod'
> &
    PagenationRequest;

// 예상 납부 스케줄 response
export type FormDraftScheduleResponse = {
    totalRepaymentAmount: string;
    totalInstallments: string;
    schedulePage: {
        content: {
            installmentNumber: string;
            paymentDate: string;
            principal: string;
            interest: string;
            paymentAmount: string;
        }[];
    };
} & Pagenation;
