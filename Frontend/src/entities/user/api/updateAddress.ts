import api from '@/shared/api/instance';

export const updateAddress = async (address: string) => {
    const response = await api.put('/users/address', {
        address,
        addressDetail: '',
    });
    return response.data;
};
