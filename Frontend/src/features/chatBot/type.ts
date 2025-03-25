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
    value: string;
    description?: string;
}

// 질문 타입 정의
export interface BotQuestion {
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
    infoTitle?: string; // 정보 제목
    infoContent?: string; // 추가 설명
}

// 역할 타입 정의
export type RoleType = '채권자' | '채무자';

// 폼 데이터 정의
export interface FormInputData {
    role: RoleType;
    loanAmount: string;
    maturityDate: string;
    interestRate: string;
    overdueInterestRate: string;
    earlyRepaymentFeeRate: string;
    repayment: boolean;
    repaymentDay: string;
    repaymentMethod: string;
    overdueLimit: string;
    specialTerms: string[];
    complete?: boolean;
}
