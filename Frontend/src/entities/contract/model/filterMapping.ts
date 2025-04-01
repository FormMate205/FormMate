import { ContractStatus, ContractStatusLabel } from './types';

// 1. Label → Status 매핑 객체
const contractStatusMap: Record<ContractStatusLabel, ContractStatus[]> = {
    전체: ['ALL'],
    대기: ['BEFORE_APPROVAL', 'AFTER_APPROVAL'],
    진행: ['IN_PROGRESS'],
    연체: ['OVERDUE'],
    완료: ['COMPLETED'],
};

// Label -> Status
export const filterLabelToStatus = (
    label: ContractStatusLabel,
): ContractStatus[] => {
    return contractStatusMap[label] ?? [];
};

// Status -> Label
export const statusToLabel = (status: ContractStatus): ContractStatusLabel => {
    for (const [label, statusList] of Object.entries(contractStatusMap)) {
        if (statusList.includes(status)) {
            return label as ContractStatusLabel;
        }
    }
    return '전체';
};

export const CONTRACT_FILTER_LABELS: ContractStatusLabel[] = [
    '전체',
    '대기',
    '진행',
    '연체',
    '완료',
];
