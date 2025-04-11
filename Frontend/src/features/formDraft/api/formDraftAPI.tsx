import { useMutation } from '@tanstack/react-query';
import { Contract } from '@/entities/contract/model/types';
import {
    FormDraftRequest,
    FormUpdateRequest,
} from '@/entities/formDraft/model/types';
import api from '@/shared/api/instance';

// 계약서 초안 생성 API
const postFormDraft = async (form: FormDraftRequest): Promise<Contract> => {
    const response = await api.post('/form', form);
    return response.data;
};

export const usePostFormDraft = () => {
    const mutation = useMutation({
        mutationFn: (form: FormDraftRequest) => postFormDraft(form),
        mutationKey: ['formDraft'],
    });

    return mutation;
};

// 계약서 초안 수정 API
const putFormDraft = async (
    formId: string,
    form: FormUpdateRequest,
): Promise<Contract> => {
    const response = await api.put(`/form/${formId}`, form);
    return response.data;
};

export const usePutFormDraft = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: (form: FormUpdateRequest) => putFormDraft(formId, form),
        mutationKey: ['formDraftUpdate', formId],
    });

    return { mutate };
};
//
