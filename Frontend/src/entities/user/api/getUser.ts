export const getUser = async (): Promise<{ name: string; email: string }> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token');
    // 모의 API 요청
    return { email: 'test@test.com', name: '홍길동' };
};
