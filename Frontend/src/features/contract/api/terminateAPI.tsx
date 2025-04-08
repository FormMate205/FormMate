import { useMutation } from '@tanstack/react-query';
import { TerminationResponse } from '@/features/signature/model/types';
import api from '@/shared/api/instance';

// 계약파기 요청
const postTerminate = async (formId: string): Promise<TerminationResponse> => {
    const response = await api.post(`/form/${formId}/termination`);
    return response.data;
};

export const usePostTerminate = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: () => postTerminate(formId),
        mutationKey: ['terminate', formId],
    });

    return { mutate };
};
