import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import {
    PostTransferRequest,
    PostTransferResponse,
    VerifyPasswordRequest,
} from '../model/types';

// 송금하기
const postTransfer = async (
    data: PostTransferRequest,
): Promise<PostTransferResponse> => {
    const response = await api.post('/transfer', data);
    return response.data;
};

export const usePostTransfer = () => {
    const mutation = useMutation({
        mutationFn: (data: PostTransferRequest) => postTransfer(data),
        mutationKey: ['transfer'],
        retry: false,
    });
    return mutation;
};

// 계좌 비밀번호 확인
const postVerifyPassword = async (data: VerifyPasswordRequest) => {
    const response = await api.post('users/account/check-password', data);
    return response.data;
};

export const usePostVerifyPassword = () => {
    return useMutation({
        mutationFn: (data: VerifyPasswordRequest) => postVerifyPassword(data),
        mutationKey: ['verifyPassword'],
        retry: false,
    });
};
