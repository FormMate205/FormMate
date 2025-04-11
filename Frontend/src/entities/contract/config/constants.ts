import { TagColor } from '@/shared/model/types';
import { ContractStatusLabel } from '../model/types';

export const CONTRACT_FILTER_LABELS: ContractStatusLabel[] = [
    '전체',
    '대기',
    '진행',
    '연체',
    '완료',
];

export const tagColorMap: Record<string, TagColor> = {
    중도: 'subPurple',
    진행: 'primary',
    연체: 'subPink',
    이자: 'line',
};

export const textColorMap: Record<TagColor, string> = {
    primary: 'text-primary-700',
    subPurple: 'text-subPurple-700',
    subPink: 'text-subPink-700',
    line: 'text-line-700',
};
