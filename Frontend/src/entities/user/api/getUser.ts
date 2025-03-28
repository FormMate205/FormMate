import axios from '@/shared/api/instance';

export interface User {
    userName: string;
    email: string;
}

export const getUser = async (): Promise<User> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');

    const { data } = await axios.get('/users/basic', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
