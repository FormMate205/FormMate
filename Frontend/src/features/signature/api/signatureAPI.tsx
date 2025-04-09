import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/shared/api/instance';
import { SignatureRequest, TerminationRequest } from '../model/types';

// 채무자 서명 요청
const postRequestDebtor = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const response = await api.post('/form/confirm/debtor', {
        formId,
        userName,
        phoneNumber,
    });
    return response.data;
};

export const usePostRequestDebtor = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: (req: SignatureRequest) => postRequestDebtor(req),
        mutationKey: ['requestDebtor', formId],
    });

    return { mutate };
};

// 채권자 서명 요청
const postRequestCreditor = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const response = await api.post('/form/confirm/creditor', {
        formId,
        userName,
        phoneNumber,
    });
    return response.data;
};

export const usePostRequestCreditor = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: (req: SignatureRequest) => postRequestCreditor(req),
        mutationKey: ['requestCreditor', formId],
    });

    return { mutate };
};

// 채무자 서명 확인
const postConfirmDebtor = async ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const response = await api.patch(`/form/confirm/debtor`, {
        formId,
        phoneNumber,
        verificationCode,
        recaptchaToken,
    });

    return response.data;
};

export const usePostConfirmDebtor = ({
    formId,
    onSuccess,
}: {
    formId: string;
    onSuccess?: (data: boolean) => void;
}) => {
    const { mutate } = useMutation({
        mutationFn: (req: TerminationRequest) => postConfirmDebtor(req),
        mutationKey: ['confirmDebtor', formId],
        onSuccess: onSuccess,
    });

    return { mutate };
};

// 채권자 서명 확인
const postConfirmCreditor = async ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    try {
        const response = await api.patch(`/form/confirm/creditor`, {
            formId,
            phoneNumber,
            verificationCode,
            recaptchaToken,
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        if (err.status === 400) {
            throw err;
        }
    }
};

export const usePostConfirmCreditor = ({
    formId,
    onSuccess,
    onError,
}: {
    formId: string;
    onSuccess?: (data: boolean) => void;
    onError?: (error: AxiosError) => void;
}) => {
    const { mutate } = useMutation({
        mutationFn: (req: TerminationRequest) => postConfirmCreditor(req),
        mutationKey: ['confirmCreditor', formId],
        onSuccess: onSuccess,
        onError: onError,
    });

    return { mutate };
};

// 계약파기 첫번째 유저 서명 요청
const postTerminateFirst = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const response = await api.post(
        `/form/${formId}/termination/firstSign/verify`,
        { userName, phoneNumber },
    );

    return response.data;
};

export const usePostTerminateFirst = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: (req: SignatureRequest) => postTerminateFirst(req),
        mutationKey: ['terminateFirst', formId],
    });

    return { mutate };
};

// 계약파기 두번째 유저 서명 요청
const postTerminateSecond = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const response = await api.post(
        `/form/${formId}/termination/secondSign/verify`,
        { userName, phoneNumber },
    );

    return response.data;
};

export const usePostTerminateSecond = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: (req: SignatureRequest) => postTerminateSecond(req),
        mutationKey: ['terminateSecond', formId],
    });

    return { mutate };
};

// 계약파기 첫번째 유저 서명 확인
const postTerminateFirstConfirm = async ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const response = await api.post(
        `/form/${formId}/termination/firstSign/confirm`,
        { phoneNumber, verificationCode, recaptchaToken },
    );

    return response.data;
};

export const usePostTerminateFirstConfirm = ({
    formId,
    onSuccess,
}: {
    formId: string;
    onSuccess?: (data: boolean) => void;
}) => {
    const { mutate } = useMutation({
        mutationFn: (req: TerminationRequest) => postTerminateFirstConfirm(req),
        mutationKey: ['terminateFirstConfirm', formId],
        onSuccess: onSuccess,
    });

    return { mutate };
};

// 계약파기 두번째 유저 서명 확인
const postTerminateSecondConfirm = async ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const response = await api.post(
        `/form/${formId}/termination/secondSign/confirm`,
        { phoneNumber, verificationCode, recaptchaToken },
    );

    return response.data;
};

export const usePostTerminateSecondConfirm = ({
    formId,
    onSuccess,
}: {
    formId: string;
    onSuccess?: (data: boolean) => void;
}) => {
    const { mutate } = useMutation({
        mutationFn: (req: TerminationRequest) =>
            postTerminateSecondConfirm(req),
        mutationKey: ['terminateSecondConfirm', formId],
        onSuccess: onSuccess,
    });

    return { mutate };
};

// 서명 차례 확인
export const getCurrentSigner = async (formId: string): Promise<boolean> => {
    const response = await api.get(`/form/${formId}/is-current-signer`);
    return response.data;
};
