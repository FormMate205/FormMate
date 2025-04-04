import { useState } from 'react';
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

interface UseSignatureProps {
    formId: string;
    type: MessageType;
    creditorId?: string;
    requstedById?: string;
}

export const useSignature = ({
    formId,
    type,
    creditorId,
    requstedById,
}: UseSignatureProps) => {
    const { user } = useUserStore();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');

    // 유효성 검사 상태
    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [phoneIsEmpty, setPhoneIsEmpty] = useState(false);
    const [codeIsEmpty, setCodeIsEmpty] = useState(false);
    const [tokenIsEmpty, setTokenIsEmpty] = useState(false);

    // 인증 관련 상태
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // API 호출
    // 채무자 인증 요청 api
    const { mutate: requestDebtor } = usePostRequestDebtor({
        formId,
        userName: name,
        phoneNumber: phone,
    });

    // 채권자 인증 요청 api
    const { mutate: requestCreditor } = usePostRequestCreditor({
        formId,
        userName: name,
        phoneNumber: phone,
    });

    // 채무자 인증 확인 api
    const { mutate: confirmDebtor } = usePostConfirmDebtor({
        formId,
        phoneNumber: phone,
        verificationCode: code,
        recaptchaToken: recaptchaToken,
    });

    // 채권자 인증 확인 api
    const { mutate: confirmCreditor } = usePostConfirmCreditor({
        formId,
        phoneNumber: phone,
        verificationCode: code,
        recaptchaToken: recaptchaToken,
    });

    // 계약파기 첫번째 인증 요청 api
    const { mutate: requestFirst } = usePostTerminateFirst({
        formId,
        userName: name,
        phoneNumber: phone,
    });

    // 계약파기 두번째 인증 요청 api
    const { mutate: requestSecond } = usePostTerminateSecond({
        formId,
        userName: name,
        phoneNumber: phone,
    });

    // 계약파기 첫번째 인증 확인 api
    const { mutate: confirmFirst } = usePostTerminateFirstConfirm({
        formId,
        phoneNumber: phone,
        verificationCode: code,
        recaptchaToken: recaptchaToken,
    });

    // 계약파기 두번째 인증 확인 api
    const { mutate: confirmSecond } = usePostTerminateSecondConfirm({
        formId,
        phoneNumber: phone,
        verificationCode: code,
        recaptchaToken: recaptchaToken,
    });

    // 인증번호 요청
    const handleRequestVerification = () => {
        const isNameValid = name.trim() !== '';
        const isPhoneValid = phone.trim() !== '';

        setNameIsEmpty(!isNameValid);
        setPhoneIsEmpty(!isPhoneValid);

        if (isNameValid && isPhoneValid) {
            if (type === 'SIGNATURE_REQUEST_CONTRACT') {
                if (creditorId === user?.id) {
                    requestCreditor();
                } else {
                    requestDebtor();
                }
            }

            if (type === 'SIGNATURE_REQUEST_TERMINATION') {
                if (requstedById !== user?.id) {
                    requestFirst();
                } else {
                    requestSecond();
                }
            }

            setIsSent(true);
        }
    };

    // 인증번호 확인 핸들러
    const handleVerifyCode = () => {
        const isCodeValid = code.trim() !== '';
        const isTokenValid = recaptchaToken.trim() !== '';

        setCodeIsEmpty(!isCodeValid);
        setTokenIsEmpty(!isTokenValid);

        if (isCodeValid && isTokenValid) {
            if (type === 'SIGNATURE_REQUEST_CONTRACT') {
                if (creditorId === user?.id) {
                    confirmCreditor();
                } else {
                    confirmDebtor();
                }
            }

            if (type === 'SIGNATURE_REQUEST_TERMINATION') {
                if (requstedById !== user?.id) {
                    confirmFirst();
                } else {
                    confirmSecond();
                }
            }

            setIsVerified(true);
        }
    };

    // ReCAPTCHA 토큰 설정 핸들러
    const handleRecaptchaChange = (token: string | null) => {
        if (!token) {
            setRecaptchaToken('');
            return;
        }

        setRecaptchaToken(token);
        setTokenIsEmpty(false);
    };

    // ReCAPTCHA 만료 핸들러
    const handleRecaptchaExpired = () => {
        setRecaptchaToken('');
        setTokenIsEmpty(true);
    };

    return {
        name,
        phone,
        code,
        recaptchaToken,
        nameIsEmpty,
        phoneIsEmpty,
        codeIsEmpty,
        tokenIsEmpty,
        isSent,
        isVerified,

        setName,
        setPhone,
        setCode,
        setRecaptchaToken,

        handleRequestVerification,
        handleVerifyCode,
        handleRecaptchaChange,
        handleRecaptchaExpired,
    };
};
