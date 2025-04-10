import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/shared/api/instance';
import { ErrorResponse } from '@/widgets/modal/types';
import { CheckAccountPayload } from '../model/types';

const checkAccount = async (payload: CheckAccountPayload) => {
    const res = await api.post('/users/account', payload);
    return res.data; // "존재하는 계좌입니다."
};

export const usePostCheckAccount = (
    onError: (error: AxiosError<ErrorResponse>) => void,
) => {
    const { mutate } = useMutation({
        mutationFn: (payload: CheckAccountPayload) => checkAccount(payload),
        onError: onError,
    });

    return { mutate };
};
