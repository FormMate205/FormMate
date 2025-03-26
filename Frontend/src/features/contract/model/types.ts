export type ContractStatus = '대기' | '진행' | '연체' | '완료';
export type TagColor = 'gray' | 'default' | 'red' | 'purple';

export interface ContractCardProps {
    name: string;
    status: ContractStatus;
    contractType?: 'send' | 'receive';
    endDate?: string;
    progress?: number;
    currentAmount?: number;
    currentMonthAmount?: number;
    totalAmount?: number;
}
