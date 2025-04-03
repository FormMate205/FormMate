export interface ContractAmountResponse {
    paidAmount: number;
    expectedTotalRepayment: number;
    receivedAmount: number;
    expectedTotalReceived: number;
}

export interface ContractItem {
    userIsCreditor: boolean;
    contracteeName: string;
    repaymentAmount: number;
}

export interface ScheduleMapResponse {
    [dateKey: string]: {
        contracts: ContractItem[];
    };
}
