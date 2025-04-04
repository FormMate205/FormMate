import { useMutation } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import {
    SignatureRequest,
    TerminationRequest,
    TerminationResponse,
} from '../model/types';

// 채무자 서명 요청
const postRequstDebtor = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const reponse = await api.post('/form/confirm/debtor', {
        formId,
        userName,
        phoneNumber,
    });
    return reponse.data;
};

export const usePostRequestDebtor = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () => postRequstDebtor({ formId, userName, phoneNumber }),
        mutationKey: ['requestDebtor', formId],
    });

    return { mutate };
};

// 채권자 서명 요청
const postRequstCreditor = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const reponse = await api.post('/form/confirm/creditor', {
        formId,
        userName,
        phoneNumber,
    });
    return reponse.data;
};

export const usePostRequestCreditor = ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const { mutate } = useMutation({
        mutationFn: () => postRequstCreditor({ formId, userName, phoneNumber }),
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
    const reponse = await api.patch(`/form/confirm/debtor`, {
        formId,
        phoneNumber,
        verificationCode,
        recaptchaToken,
    });

    return reponse.data;
};

export const usePostConfirmDebtor = ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postConfirmDebtor({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['confirmDebtor', formId],
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
    const reponse = await api.patch(`/form/confirm/creditor`, {
        formId,
        phoneNumber,
        verificationCode,
        recaptchaToken,
    });

    return reponse.data;
};

export const usePostConfirmCreditor = ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postConfirmCreditor({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['confirmCreditor', formId],
    });

    return { mutate };
};

// 계약파기 요청
const postTerminate = async (formId: string): Promise<TerminationResponse> => {
    const reponse = await api.post(`/form/${formId}/termination`);
    return reponse.data;
};

export const usePostTerminate = (formId: string) => {
    const { mutate } = useMutation({
        mutationFn: () => postTerminate(formId),
        mutationKey: ['terminate', formId],
    });

    return { mutate };
};

// 계약파기 첫번째 유저 서명 요청
const postTerminateFirst = async ({
    formId,
    userName,
    phoneNumber,
}: SignatureRequest) => {
    const reponse = await api.post(
        `/form/${formId}/termination/firstSign/verify`,
        { userName, phoneNumber },
    );

    return reponse.data;
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
    const reponse = await api.post(
        `/form/${formId}/termination/secondSign/verify`,
        { userName, phoneNumber },
    );

    return reponse.data;
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
    const reponse = await api.post(
        `/form/${formId}/termination/firstSign/confirm`,
        { phoneNumber, verificationCode, recaptchaToken },
    );

    return reponse.data;
};

export const usePostTerminateFirstConfirm = ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postTerminateFirstConfirm({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['terminateFirstConfirm', formId],
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
    const reponse = await api.post(
        `/form/${formId}/termination/secondSign/confirm`,
        { phoneNumber, verificationCode, recaptchaToken },
    );

    return reponse.data;
};

export const usePostTerminateSecondConfirm = ({
    formId,
    phoneNumber,
    verificationCode,
    recaptchaToken,
}: TerminationRequest) => {
    const { mutate } = useMutation({
        mutationFn: () =>
            postTerminateSecondConfirm({
                formId,
                phoneNumber,
                verificationCode,
                recaptchaToken,
            }),
        mutationKey: ['terminateSecondConfirm', formId],
    });

    return { mutate };
};
