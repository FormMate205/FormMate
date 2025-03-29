import { LoginFormSchema } from '../types';

// 임시 mock 데이터
export const login = async ({ email, password }: LoginFormSchema) => {
    if (email === 'test@test.com' && password === 'test123!') {
        return {
            success: true,
            token: 'mock-token-1234',
            user: { email, name: '홍길동' },
        };
    } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
};
