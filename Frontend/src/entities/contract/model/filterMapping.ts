import { ContractStatus, ContractStatusLabel } from './types';

const statusToLabelMap: Record<ContractStatus, ContractStatusLabel> = {
    ALL: '전체',
    BEFORE_APPROVAL: '대기',
    AFTER_APPROVAL: '대기',
    IN_PROGRESS: '진행',
    OVERDUE: '연체',
    COMPLETED: '완료',
};

// Label -> Status[]
export const labelToStatus = (label: ContractStatusLabel): ContractStatus[] => {
    return Object.entries(statusToLabelMap)
        .filter(([, l]) => l === label)
        .map(([status]) => status as ContractStatus);
};

// Status -> Label
export const statusToLabel = (status: ContractStatus): ContractStatusLabel =>
    statusToLabelMap[status] ?? '전체'; // default:전체
