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

// 특약 사항
export interface SpecialTerm {
    specialTermIndex: string;
    specialTermDetail: string;
}

// 계약 상태 관련 태그
export type ContractStatus = '대기' | '진행' | '연체' | '완료';

export interface ContractCardProps {
    id: string;
    name: string;
    status: ContractStatus;
    contractType?: 'send' | 'receive';
    endDate?: string;
    progress?: number;
    currentAmount?: number;
    currentMonthAmount?: number;
    totalAmount?: number;
}

// 사용자의 계약 상태별 개수
export type GetContractStatusCountResponse = {
    formPendingCount: number;
    formActiveCount: number;
    formCompletedCount: number;
};

// 보낼, 받을 금액 (차트)
export type ContractAmountSummary = {
    paidAmount: number;
    expectedTotalRepayment: number;
    receivedAmount: number;
    expectedTotalReceived: number;
};

export type GetContractAmountChart = ContractAmountSummary;

// 계약 상세
export type GetContractDetail = Contract;
