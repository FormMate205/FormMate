import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageType } from '@/entities/chat/model/types';
import { useUserStore } from '@/entities/user/model/userStore';
import {
    usePostConfirmCreditor,
    usePostConfirmDebtor,
    usePostRequestCreditor,
    usePostRequestDebtor,
    usePostTerminateFirst,
    usePostTerminateFirstConfirm,
    usePostTerminateSecond,
    usePostTerminateSecondConfirm,
} from '../api/signatureAPI';
import {
    signatureFormSchema,
    SignatureFormValues,
} from './signatureFormSchema';

interface UseSignatureProps {
    formId: string;
    type: MessageType;
    requestedById?: string;
}

export const useSignature = ({
    formId,
    type,
    requestedById,
}: UseSignatureProps) => {
    const { user } = useUserStore();

    // 폼 상태 관리
    const form = useForm<SignatureFormValues>({
        resolver: zodResolver(signatureFormSchema),
        defaultValues: {
            name: '',
            phone: '',
            code: '',
            recaptchaToken: '',
        },
    });

    // 인증 관련 상태
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [tokenIsEmpty, setTokenIsEmpty] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState<
        string | null
    >(null);
    const [verificationSuccess, setVerificationSuccess] = useState<
        boolean | null
    >(null);

    // 인증 응답 처리 함수
    const handleVerificationResponse = (response: boolean) => {
        if (response) {
            setVerificationSuccess(true);
            setVerificationMessage('인증이 완료되었습니다.');
            setIsVerified(true);
        } else {
            setVerificationSuccess(false);
            setVerificationMessage('인증을 실패했습니다. 다시 시도해주세요.');
            setIsVerified(false);
        }
    };

    // API 호출
    // 채무자 인증 요청 api
    const { mutate: requestDebtor } = usePostRequestDebtor({
        formId,
        userName: form.getValues('name'),
        phoneNumber: form.getValues('phone'),
    });

    // 채권자 인증 요청 api
    const { mutate: requestCreditor } = usePostRequestCreditor({
        formId,
        userName: form.getValues('name'),
        phoneNumber: form.getValues('phone'),
    });

    // 채무자 인증 확인 api
    const { mutate: confirmDebtor } = usePostConfirmDebtor({
        formId,
        phoneNumber: form.getValues('phone'),
        verificationCode: form.getValues('code')!,
        recaptchaToken: form.getValues('recaptchaToken')!,
        onSuccess: handleVerificationResponse,
    });

    // 채권자 인증 확인 api
    const { mutate: confirmCreditor } = usePostConfirmCreditor({
        formId,
        phoneNumber: form.getValues('phone'),
        verificationCode: form.getValues('code')!,
        recaptchaToken: form.getValues('recaptchaToken')!,
        onSuccess: handleVerificationResponse,
    });

    // 계약파기 첫번째 인증 요청 api
    const { mutate: requestFirst } = usePostTerminateFirst({
        formId,
        userName: form.getValues('name'),
        phoneNumber: form.getValues('phone'),
    });

    // 계약파기 두번째 인증 요청 api
    const { mutate: requestSecond } = usePostTerminateSecond({
        formId,
        userName: form.getValues('name'),
        phoneNumber: form.getValues('phone'),
    });

    // 계약파기 첫번째 인증 확인 api
    const { mutate: confirmFirst } = usePostTerminateFirstConfirm({
        formId,
        phoneNumber: form.getValues('phone'),
        verificationCode: form.getValues('code')!,
        recaptchaToken: form.getValues('recaptchaToken')!,
        onSuccess: handleVerificationResponse,
    });

    // 계약파기 두번째 인증 확인 api
    const { mutate: confirmSecond } = usePostTerminateSecondConfirm({
        formId,
        phoneNumber: form.getValues('phone'),
        verificationCode: form.getValues('code')!,
        recaptchaToken: form.getValues('recaptchaToken')!,
        onSuccess: handleVerificationResponse,
    });

    // 인증번호 요청
    const handleRequestVerification = async () => {
        const result = await form.trigger(['name', 'phone']);

        if (result) {
            if (type === 'SIGNATURE_REQUEST_CONTRACT') {
                if (requestedById === user?.id) {
                    requestCreditor();
                } else {
                    requestDebtor();
                }
            }

            if (type === 'SIGNATURE_REQUEST_TERMINATION') {
                if (requestedById !== user?.id) {
                    requestFirst();
                } else {
                    requestSecond();
                }
            }

            setIsSent(true);
            // 새로운 인증 요청 시 기존 메시지 초기화
            setVerificationMessage(null);
            setVerificationSuccess(null);
        }
    };

    // 인증번호 확인 핸들러
    const handleVerifyCode = () => {
        const isCodeValid = !!form.getValues('code');
        const isTokenValid = !!form.getValues('recaptchaToken');

        form.trigger('code');
        setTokenIsEmpty(!isTokenValid);

        if (isCodeValid && isTokenValid) {
            if (type === 'SIGNATURE_REQUEST_CONTRACT') {
                if (requestedById === user?.id) {
                    confirmCreditor();
                } else {
                    confirmDebtor();
                }
            }

            if (type === 'SIGNATURE_REQUEST_TERMINATION') {
                if (requestedById !== user?.id) {
                    confirmFirst();
                } else {
                    confirmSecond();
                }
            }
        }
    };

    // ReCAPTCHA 토큰 설정 핸들러
    const handleRecaptchaChange = (token: string | null) => {
        if (!token) {
            form.setValue('recaptchaToken', '');
            setTokenIsEmpty(true);
            return;
        }

        form.setValue('recaptchaToken', token);
        setTokenIsEmpty(false);
    };

    // ReCAPTCHA 만료 핸들러
    const handleRecaptchaExpired = () => {
        form.setValue('recaptchaToken', '');
        setTokenIsEmpty(true);
    };

    return {
        form,
        isSent,
        isVerified,
        tokenIsEmpty,
        verificationMessage,
        verificationSuccess,
        handleRequestVerification,
        handleVerifyCode,
        handleRecaptchaChange,
        handleRecaptchaExpired,
    };
};
