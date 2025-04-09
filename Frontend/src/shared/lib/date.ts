// D-day 반환
export const getDday = (targetDate: string): string => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 하루 단위

    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-Day';
    return `D+${Math.abs(diffDays)}`;
};

// utils/date.ts
export const formatContractDuration = (duration: string): string => {
    const [start, end] = duration.split(' ~ ');
    const formatDate = (dateStr: string) => dateStr.split('T')[0];
    return `${formatDate(start)} ~ ${formatDate(end)}`;
};
