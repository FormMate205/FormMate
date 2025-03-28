import { FormPartner } from '@/entities/formDraft/model/types';
import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 최근 계약 상대 목록 response
export type RecentFormPartnerResponse = {
    content: FormPartner[];
} & Pagenation;

// 최근 계약 상대 검색 resquest
export type SearchRecentFormPartnerRequest = PagenationRequest & {
    input: string;
};

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
