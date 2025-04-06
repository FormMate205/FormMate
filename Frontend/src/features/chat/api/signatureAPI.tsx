import { useMutation } from '@tanstack/react-query';
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

export const usePostRequestDebtor = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () => postRequestDebtor({ formId, userName, phoneNumber }),
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

export const usePostRequestCreditor = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postRequestCreditor({ formId, userName, phoneNumber }),
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
    phoneNumber,
    verificationCode,
    recaptchaToken,
    onSuccess,
}: TerminationRequest & { onSuccess?: (data: boolean) => void }) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postConfirmDebtor({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
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
    const response = await api.patch(`/form/confirm/creditor`, {
        formId,
        phoneNumber,
        verificationCode,
        recaptchaToken,
    });

    return response.data;
};

export const usePostConfirmCreditor = ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
    onSuccess,
}: TerminationRequest & { onSuccess?: (data: boolean) => void }) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postConfirmCreditor({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['confirmCreditor', formId],
        onSuccess: onSuccess,
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

export const usePostTerminateFirst = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () => postTerminateFirst({ formId, userName, phoneNumber }),
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

export const usePostTerminateSecond = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postTerminateSecond({ formId, userName, phoneNumber }),
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
    phoneNumber,
    verificationCode,
    recaptchaToken,
    onSuccess,
}: TerminationRequest & { onSuccess?: (data: boolean) => void }) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postTerminateFirstConfirm({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
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
    phoneNumber,
    verificationCode,
    recaptchaToken,
    onSuccess,
}: TerminationRequest & { onSuccess?: (data: boolean) => void }) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postTerminateSecondConfirm({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['terminateSecondConfirm', formId],
        onSuccess: onSuccess,
    });

    return { mutate };
};
