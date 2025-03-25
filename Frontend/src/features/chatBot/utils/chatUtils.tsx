import { FormDraftRequest } from '@/entities/types/form';

// 범위 검증
export const validateRange = (
    value: string,
    min: number = 0,
    max: number = 100,
): boolean => {
    const range = parseFloat(value);
    return !isNaN(range) && range >= min && range <= max;
};

// 폼데이터 검증
export const validateFormDraft = (
    formDraft: FormDraftRequest,
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 필수 필드 검증
    if (!formDraft.loanAmount) errors.push('대여 금액이 입력되지 않았습니다.');
    if (!formDraft.maturityDate)
        errors.push('상환 날짜가 입력되지 않았습니다.');
    if (!formDraft.interestRate) errors.push('이자율이 입력되지 않았습니다.');
    if (!formDraft.overdueInterestRate)
        errors.push('연체 이자율이 입력되지 않았습니다.');

    // 이자율 합 검증 (20% 초과 불가)
    const interestRate = parseFloat(formDraft.interestRate) || 0;
    const overdueInterestRate = parseFloat(formDraft.overdueInterestRate) || 0;

    if (interestRate + overdueInterestRate > 20) {
        errors.push('이자율과 연체 이자율의 합이 20%를 초과할 수 없습니다.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
