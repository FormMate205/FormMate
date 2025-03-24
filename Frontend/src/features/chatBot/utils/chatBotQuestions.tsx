// 입력값 타입
export type InputType =
    | 'role'
    | 'number'
    | 'date'
    | 'boolean'
    | 'method'
    | 'select';

// 질문에 대한 옵션
export interface Option {
    label: string;
    value: string;
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
}

// 질문 리스트
export const chatBotQuestions: Record<string, BotQuestion> = {
    role: {
        id: 'role',
        question: '당신은 채권자인가요, 채무자인가요?',
        type: 'role',
        options: [
            { label: '채권자', value: 'creditor' },
            { label: '채무자', value: 'debtor' },
        ],
        next: 'loanAmount',
    },
    loanAmount: {
        id: 'loanAmount',
        question: '대여 금액은 얼마인가요?',
        type: 'number',
        condition: ['✅ 숫자만 입력해주세요.'],
        validation: {
            regex: '^[0-9]+$',
            errorMessage: '숫자만 입력해주세요.',
        },
        next: 'maturityDate',
    },
    maturityDate: {
        id: 'maturityDate',
        question: '상환 날짜를 입력해주세요.',
        type: 'date',
        condition: ['✅ YYYY-MM-DD 형식으로 입력해주세요.'],
        validation: {
            regex: '^\\d{4}-\\d{2}-\\d{2}$',
            errorMessage: 'YYYY-MM-DD 형식으로 입력해주세요.',
        },
        next: 'interestRate',
    },
    interestRate: {
        id: 'interestRate',
        question: '이자율을 입력해주세요.',
        type: 'number',
        condition: [
            '✅ 0~20% 범위 내로 입력해주세요.',
            '✅ 숫자로만 입력해주세요. (소수점 둘째 짜리까지 입력 가능)',
        ],
        validation: {
            regex: '^[0-9]+(\\.[0-9]{1,2})?$',
            errorMessage: '0~20% 범위 내의 숫자로만 입력해주세요.',
            min: '0',
            max: '20',
        },
        next: 'overdueInterestRate',
    },
    overdueInterestRate: {
        id: 'overdueInterestRate',
        question: '연체 이자율을 입력해주세요.',
        type: 'number',
        condition: [
            '✅ 0~20% 범위 내로 입력해주세요.',
            '✅ 숫자로만 입력해주세요. (소수점 둘째 짜리까지 입력 가능)',
            '✅ 이자율 + 연체 이자율은 20%를 초과할 수 없습니다.',
        ],
        validation: {
            regex: '^[0-9]+(\\.[0-9]{1,2})?$',
            errorMessage: '0~20% 범위 내의 숫자로만 입력해주세요.',
            min: '0',
            max: '20',
        },
        next: 'repayment',
    },
    repayment: {
        id: 'repayment',
        question: '분할 납부를 희망하십니까?',
        type: 'boolean',
        options: [
            { label: '네', value: 'yes' },
            { label: '아니오', value: 'no' },
        ],
        next: (answer) =>
            answer === '네' ? 'repaymentDay' : 'earlyRepaymentFeeRate',
    },
    repaymentDay: {
        id: 'repaymentDay',
        question: '분할 납부일을 입력해주세요.',
        type: 'number',
        condition: [
            '✅ 숫자로만 입력해주세요.',
            '✅ 29~31일 적용 시 해당 날짜가 없는 달은 말일로 적용됩니다.',
        ],
        validation: {
            regex: '^[0-9]+$',
            errorMessage: '유효한 날짜를 숫자로만 입력해주세요.',
            min: '0',
            max: '31',
        },
        next: 'repayment',
    },
    repaymentMethod: {
        id: 'repaymentMethod',
        question:
            '분할 납부를 희망한다면 아래의 두가지 상환 방법 중 하나를 선택해주세요.',
        type: 'method',
        options: [
            { label: '원리금 균등상환', value: '원리금균등상환' },
            { label: '원금 균등상환', value: '원금균등상환' },
        ],
        condition: [
            '✅ 미리보기 버튼을 누르면, 입력한 정보를 기반으로 납부 일정과 예상 납부 금액을 확인할 수 있습니다.',
        ],
        next: 'earlyRepaymentFeeRate',
    },
    earlyRepaymentFeeRate: {
        id: 'earlyRepaymentFeeRate',
        question: '중도 상환 시 부과할 수수료율을 입력해주세요.',
        type: 'number',
        condition: [
            '✅ 1.5% 범위 내로 입력해주세요.',
            '✅ 숫자로만 입력해주세요. (소수점 둘째 짜리까지 입력 가능)',
        ],
        validation: {
            regex: '^[0-9]+(\\.[0-9]{1,2})?$',
            errorMessage: '1.5% 범위 내의 숫자로만 입력해주세요.',
            min: '0',
            max: '1,5',
        },
        next: 'overdueLimit',
    },
    overdueLimit: {
        id: 'overdueInterestRate',
        question:
            '기한이익상실 조항은 채무자가 지정한 연체 횟수를 초과할 경우 남은 채무를 즉시 갚는 조항입니다. 연체 횟수를 지정해주세요.',
        type: 'number',
        condition: [
            '✅ 숫자로만 입력해주세요.',
            '✅ 기한이익상실 조항을 추가하지 않는다면 0을 입력해주세요.',
            '예시: 채무자가 연체 3회를 초과하면, 남은 채무를 즉시 갚아야 합니다.',
        ],
        validation: {
            regex: '^[0-9]+$',
            errorMessage: '숫자로만 입력해주세요.',
        },
        next: 'specialTerm',
    },
    specialTerm: {
        id: 'specialTerm',
        question: '계약서에 포함할 특약 사항을 체크해주세요.',
        type: 'select',
        options: [
            { label: '법적 조치 조항', value: '1' },
            { label: '대여금 사용 용도 제한 조항', value: '2' },
            { label: '분쟁 해결 조항', value: '3' },
            { label: '불이행 시 조치 조항', value: '4' },
        ],
        next: 'complete',
    },
    complete: {
        id: 'complete',
        question: '모든 정보가 입력되었습니다. 계약서를 생성하시겠습니까?',
        type: 'boolean',
        options: [
            { label: '네', value: 'yes' },
            { label: '아니오', value: 'no' },
        ],
    },
};
