import api from '@/shared/api/instance';
import { User } from '../model/types';

export const getUser = async (): Promise<User> => {
    const response = await api.get('/users/basic');
    return response.data;
};
