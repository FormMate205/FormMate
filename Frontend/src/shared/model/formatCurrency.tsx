// 금액 변환
export const formatCurrency = (amount: string) => {
    const numAmount =
        typeof amount === 'string' ? parseInt(amount, 10) : amount;
    if (isNaN(numAmount)) return '0원';

    return numAmount.toLocaleString('ko-KR') + '원';
};
