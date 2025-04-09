import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { PostTransferRequest, PostTransferResponse } from '../model/types';

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
