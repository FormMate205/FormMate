import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/shared/api/instance';
import { ErrorResponse } from '@/widgets/modal/types';
import { RegisterAccountPayload } from '../model/types';

const registerAccount = async (payload: RegisterAccountPayload) => {
    const response = await api.put('/users/account/register', payload);
    return response.data;
};

export const usePutRegisterAccount = (
    onError: (error: AxiosError<ErrorResponse>) => void,
) => {
    const { mutate } = useMutation({
        mutationFn: (payload: RegisterAccountPayload) =>
            registerAccount(payload),
        onError: onError,
    });

    return { mutate };
};
