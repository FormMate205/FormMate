import { useMutation } from '@tanstack/react-query';
import { Contract } from '@/entities/contract/model/types';
import { FormDraftRequest } from '@/entities/formDraft/model/types';
import api from '@/shared/api/instance';

// 계약서 초안 생성 API
const postFormDraft = async (form: FormDraftRequest): Promise<Contract> => {
    const response = await api.post('/form', form);
    return response.data;
};

export const usePostFormDraft = () => {
    const { mutate } = useMutation({
        mutationFn: (form: FormDraftRequest) => postFormDraft(form),
        mutationKey: ['formDraft'],
    });

    return { mutate };
};
