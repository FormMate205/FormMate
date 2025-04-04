import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageType } from '@/entities/chat/model/types';
import { useSignature } from '../model/useSignature';

interface SignatureFormProps {
    formId: string;
    type: MessageType;
}

const SignatureForm = ({ formId, type }: SignatureFormProps) => {
    // 입력 및 인증 상태 관리
    const {
        name,
        phone,
        code,
        nameIsEmpty,
        phoneIsEmpty,
        codeIsEmpty,
        tokenIsEmpty,
        isSent,
        isVerified,

        setName,
        setPhone,
        setCode,

        handleRequestVerification,
        handleVerifyCode,
        handleRecaptchaChange,
        handleRecaptchaExpired,
    } = useSignature({ formId, type });

    return (
        <div className='flex w-full flex-col'>
            <p className='text-2xl font-semibold'>Formmate 전자 인증</p>
            <div className='mt-10 mb-5 flex flex-col gap-4'>
                <div className='flex w-full flex-col gap-1'>
                    <p className='text-lg'>성명</p>
                    <Input
                        variant='nessesary'
                        placeholder='이름을 입력하세요.'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isEmpty={nameIsEmpty}
                    />
                    {nameIsEmpty && (
                        <p className='text-subPink-700'>성명을 입력하세요.</p>
                    )}
                </div>

                <div className='flex w-full flex-col gap-1'>
                    <p className='text-lg'>전화번호</p>
                    <div className='flex w-full gap-2'>
                        <Input
                            variant='nessesary'
                            placeholder="'-'를 제외하고 입력하세요."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            isEmpty={phoneIsEmpty}
                            inputMode='numeric'
                        />
                        <Button
                            variant='default'
                            className='whitespace-nowrap'
                            onClick={handleRequestVerification}
                        >
                            인증
                        </Button>
                    </div>

                    {phoneIsEmpty && (
                        <p className='text-subPink-700'>
                            전화번호를 입력하세요.
                        </p>
                    )}

                    {isSent && (
                        <div className='flex flex-col gap-1'>
                            <p className='text-primary-500 pl-1'>
                                입력하신 전화번호로 인증번호가 전송되었습니다.
                            </p>
                            <div className='flex w-full gap-2'>
                                <Input
                                    variant='default'
                                    placeholder='인증번호를 입력하세요.'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    isEmpty={codeIsEmpty}
                                />
                                <Button
                                    variant='default'
                                    className='whitespace-nowrap'
                                    onClick={handleVerifyCode}
                                >
                                    확인
                                </Button>
                            </div>
                        </div>
                    )}

                    {isVerified && (
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={handleRecaptchaChange}
                            onExpired={handleRecaptchaExpired}
                        />
                    )}

                    {tokenIsEmpty && (
                        <p className='text-red-500'>
                            ReCAPTCHA 인증이 필요합니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignatureForm;
