export type ContractStatus =
    | 'BEFORE_APPROVAL'
    | 'AFTER_APPROVAL'
    | 'IN_PROGRESS'
    | 'OVERDUE'
    | 'COMPLETED';

export type ContractCard = {
    status: ContractStatus;
    userIsCreditor: boolean;
    contracteeName: string;
    maturityDate: string;
    nextRepaymentAmount: number;
    totalRepaymentAmount: number;
    totalAmountDue: number;
};

// 차용증 리스트 조회
export type GetContractsRequest = {
    status: ContractStatus[];
};

export type GetContractsResponse = ContractCard[];

// 납부요약
export interface PaymentSummary {
    paidPrincipalAmount: number; // 납부한 원금
    paidInterestAmount: number; // 납부한 이자
    paidOverdueInterestAmount: number; // 납부한 연체이자
    totalEarlyRepaymentFee: number; // 중도상환 수수료 총액
    unpaidAmount: number; // 미납 금액
    expectedPaymentAmountAtMaturity: number; // 만기 시 예상 납부 총액
    expectedPrincipalAmountAtMaturity: number; // 만기 시 총 원금
    expectedInterestAmountAtMaturity: number; // 만기 시 총 이자
}

export type GetPaymentSummaryResponse = PaymentSummary;
