export const getSignatureStatus = (
    status: string,
    role: 'creditor' | 'debtor',
): string => {
    if (status === '상대 승인전') return '(전자서명 미완료)';
    if (status === '상대승인후') {
        return role === 'debtor' ? '(전자서명 완료)' : '(전자서명 미완료)';
    }
    return '(전자서명 완료)';
};
