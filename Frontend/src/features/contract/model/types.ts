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
