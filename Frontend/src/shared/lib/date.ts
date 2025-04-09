// D-day 반환
export const getDday = (targetDate: string | number[]): string => {
    const now = new Date();
    let target: Date;

    if (Array.isArray(targetDate)) {
        const [year, month, day] = targetDate;
        target = new Date(year, month - 1, day);
    } else {
        target = new Date(targetDate);
    }

    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 하루 단위

    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-Day';
    return `D+${Math.abs(diffDays)}`;
};

// 계약기간 형식 변경
export const formatContractDuration = (duration: string): string => {
    const [start, end] = duration.split(' ~ ');
    const formatDate = (dateStr: string) => dateStr.split('T')[0];
    return `${formatDate(start)} ~ ${formatDate(end)}`;
};

// 배열 형태의 날짜를 문자열로 변환
export const formatDateString = (date: string | number[]): string => {
    if (Array.isArray(date)) {
        const [year, month, day] = date;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    // 예외 처리: string이라면 그대로 반환하거나 fallback
    return String(date);
};
