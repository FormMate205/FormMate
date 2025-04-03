import api from '@/shared/api/instance';

export const deleteAccount = async () => {
    const response = await api.delete('/users/account');
    return response.data;
};
