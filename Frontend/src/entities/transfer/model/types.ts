export type TabListItem = {
    id: string;
    title: string;
    subString: string;
};

export interface ContractItem {
    formId: string;
    userIsCreditor: boolean;
    nextRepaymentAmount: number;
    nextRepaymentDate: string;
    contractDuration: string;
}
