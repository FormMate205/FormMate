export interface ContractItem {
    formId: string;
    userIsCreditor: boolean;
    nextRepaymentAmount: number;
    nextRepaymentDate: string;
    contractDuration: string;
}
