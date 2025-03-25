export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0] + 'T00:00:00';
    } catch (error) {
        console.error('날짜 형식 변환 오류:', error);
    }
};
