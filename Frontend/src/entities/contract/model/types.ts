// 계약서
export interface Contract {
    formId: string; // 계약서 id
    status: string; // 계약 현황
    creatorId: string; // 게약 생성자
    creatorName: string;
    receiverId: string;
    receiverName: string;
    creditorId: string; // 채권자
    debtorId: string; // 채무자
    creditorName: string;
    creditorAddress: string;
    creditorPhone: string;
    creditorBank: string;
    creditorAccount: string;
    debtorName: string;
    debtorAddress: string;
    debtorPhone: string;
    debtorBank: string;
    debtorAccount: string;
    contractDate: string; // 계약 생성일
    maturityDate: string; // 계약 만료일
    loanAmount: string; // 대출 원금
    repaymentMethod: string; // 분할 납부 방법
    repaymentDay: string; // 분할 상환 일자
    interestRate: string; // 이자율
    earlyRepaymentFeeRate: string; // 중도 상환 수수료
    overdueInterestRate: string; // 연체 이자율
    overdueLimit: string; // 연체 횟수
    specialTerms: SpecialTerm[];
}

// 차용증 목록 조회 카드
export type ContractCard = Pick<Contract, 'formId'> & {
    status: ContractStatus;
    userIsCreditor: boolean;
    contracteeName: string;
    maturityDate: number[];
    nextRepaymentAmount: number;
    totalRepaymentAmount: number;
    totalAmountDue: number;
};

// 거래 내역
export type PaymentStatus = '납부' | '연체' | '전체' | '중도상환';

export interface PaymentHistoryItem {
    status: PaymentStatus;
    currentRound: string;
    amount: number;
    paymentDifference: number;
    transactionDate: string;
}

// 계약 상태 관련 태그
export type ContractStatus =
    | 'ALL'
    | 'BEFORE_APPROVAL'
    | 'AFTER_APPROVAL'
    | 'IN_PROGRESS'
    | 'OVERDUE'
    | 'COMPLETED';

export type ContractStatusLabel = '전체' | '대기' | '진행' | '연체' | '완료';

// 계약 파기 상태 관련 태그
// NONE(정상): 계약 파기 신청 안한 상황
// REQUESTED(신청): 한 사람이 계약 파기 신청 후 상대의 동의를 기다리는 상황
// SIGNED(상대방 서명): 상대가 서명한 상황
export type TerminationStatus = 'NONE' | 'REQUESTED' | 'SIGNED';

// 특약 사항
export interface SpecialTerm {
    specialTermIndex: string;
    specialTermDetail: string;
}

// 사용자의 계약 상태별 개수
export type GetContractStatusCountResponse = {
    formPendingCount: number;
    formActiveCount: number;
    formCompletedCount: number;
};

// 보낼, 받을 금액 (차트)
export type ContractAmountChart = {
    paidAmount: number;
    expectedTotalRepayment: number;
    receivedAmount: number;
    expectedTotalReceived: number;
};

// 계약 상세 조회 상단 내용
export type ContractDetailOverview = {
    userIsCreditor: boolean;
    contracteeName: string;
    overdueCount: number;
    overdueLimit: number;
    overdueAmount: number;
    nextRepaymentDate: number[];
    earlyRepaymentCount: number;
    totalEarlyRepaymentCharge: number;
    repaymentAmount: number;
    remainingPrincipal: number;
};

export type GetContractDetailResponse = Contract;

// 납부 요약
export type ContractOverview = {
    paidPrincipalAmount: number; // 납부한 원금
    paidInterestAmount: number; // 납부한 이자
    paidOverdueInterestAmount: number; // 납부한 연체이자
    totalEarlyRepaymentFee: number; // 중도상환 수수료 총액
    unpaidAmount: number; // 미납 금액
    expectedPaymentAmountAtMaturity: number; // 만기 시 예상 납부 총액
    expectedPrincipalAmountAtMaturity: number; // 만기 시 총 원금
    expectedInterestAmountAtMaturity: number; // 만기 시 총 이자
};
