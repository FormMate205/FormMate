import api from '@/shared/api/instance';

interface RegisterAccountPayload {
    verificationCode: string;
    bankName: string;
    accountNumber: string;
    accountPassword: string;
}

export const registerAccount = async (payload: RegisterAccountPayload) => {
    const response = await api.put('/users/account/register', payload);
    return response.data;
};
