export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + 'T00:00:00';
};
