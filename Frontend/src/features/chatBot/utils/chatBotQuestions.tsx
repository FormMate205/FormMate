import { BotQuestion } from '../type';

// 특약 조항
export const specialTermsInfo = [
    {
        id: '1',
        title: '법적 조치 조항',
        content:
            '채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다. 이는 대여금 반환 소송 등을 의미합니다.',
    },
    {
        id: '2',
        title: '대여금 사용 용도 제한 조항',
        content:
            '빌려간 돈을 생활비 등 특정 용도로 사용해야 하며, 도박 등 부적절한 용도로 사용할 수 없습니다.',
    },
    {
        id: '3',
        title: '분쟁 해결 조항',
        content:
            '계약과 관련한 분쟁이 발생할 경우 대한민국 법률을 따르며, 관할 법원은 채권자 또는 채무자의 주소지를 고려하여 결정할 수 있습니다.',
    },
    {
        id: '4',
        title: '불이행 시 조치 조항',
        content:
            '채무자가 계약을 지키지 않을 경우, 발생하는 법적 비용(소송 비용 등)은 채무자가 부담해야 합니다.',
    },
];

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
        question: '대여 금액을 입력해주세요.',
        type: 'number',
        condition: [
            '✅ 만 원 이상의 금액을 입력해주세요.',
            '✅ 숫자만 입력해주세요.',
        ],
        validation: {
            regex: '^\\d+$',
            errorMessage: '만 원 이상의 숫자로만 입력해주세요.',
            min: '10000',
        },
        next: 'maturityDate',
    },
    maturityDate: {
        id: 'maturityDate',
        question: '상환 날짜를 선택한 후 확인 버튼을 눌러주세요.',
        type: 'date',
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
            regex: '^\\d+(\\.\\d{1,2})?$',
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
            regex: '^\\d+(\\.\\d{1,2})?$',
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
            { label: '네', value: true },
            { label: '아니오', value: false },
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
            regex: '^\\d+$',
            errorMessage: '유효한 날짜를 숫자로만 입력해주세요.',
            min: '1',
            max: '31',
        },
        next: 'repaymentMethod',
    },
    repaymentMethod: {
        id: 'repaymentMethod',
        question:
            '분할 납부를 희망한다면 아래의 두가지 상환 방법 중 하나를 선택해주세요.',
        type: 'method',
        options: [
            {
                label: '원리금 균등상환',
                value: '원리금균등상환',
                description:
                    '매달 원금 + 이자를 합한 금액을 동일하게 상환합니다.',
            },
            {
                label: '원금 균등상환',
                value: '원금균등상환',
                description:
                    '매달 동일한 원금을 갚고, 남은 금액에 대해 이자를 납부합니다.',
            },
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
            regex: '^\\d+(\\.\\d{1,2})?$',
            errorMessage: '1.5% 범위 내의 숫자로만 입력해주세요.',
            min: '0',
            max: '1.5',
        },
        next: 'overdueLimit',
    },
    overdueLimit: {
        id: 'overdueLimit',
        question:
            '기한이익상실 조항은 채무자가 지정한 연체 횟수를 초과할 경우 남은 채무를 즉시 갚는 조항입니다. 연체 횟수를 지정해주세요.',
        type: 'number',
        condition: [
            '✅ 숫자로만 입력해주세요.',
            '✅ 기한이익상실 조항을 추가하지 않는다면 0을 입력해주세요.',
            '예시: 채무자가 연체 3회를 초과하면, 남은 채무를 즉시 갚아야 합니다.',
        ],
        validation: {
            regex: '^\\d+$',
            errorMessage: '숫자로만 입력해주세요.',
            min: '0',
        },
        next: 'specialTerms',
    },
    specialTerms: {
        id: 'specialTerms',
        question: '계약서에 포함할 특약 사항을 선택해 주세요.',
        type: 'specialTerms',
        next: 'complete',
    },
    complete: {
        id: 'complete',
        question: '모든 정보가 입력되었습니다. 계약서를 생성하시겠습니까?',
        type: 'boolean',
        options: [
            { label: '네', value: true },
            { label: '아니오', value: false },
        ],
    },
};
