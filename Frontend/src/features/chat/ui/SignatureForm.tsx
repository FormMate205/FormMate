import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MessageType } from '@/entities/chat/model/types';
import { useSignature } from '../model/useSignature';

interface SignatureFormProps {
    formId: string;
    type: MessageType;
    creditorId?: string;
}

const SignatureForm = ({ formId, type, creditorId }: SignatureFormProps) => {
    // 입력 및 인증 상태 관리
    const {
        form,
        isSent,
        verificationMessage,
        verificationSuccess,
        handleRequestVerification,
        handleVerifyCode,
        handleRecaptchaChange,
        handleRecaptchaExpired,
    } = useSignature({ formId, type, creditorId });

    return (
        <div className='flex w-full flex-col'>
            <p className='text-2xl font-semibold'>Formmate 전자 인증</p>
            <Form {...form}>
                <form className='mt-10 mb-5 flex flex-col gap-4'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='flex w-full flex-col gap-1'>
                                <FormLabel className='text-lg'>성명</FormLabel>
                                <FormControl>
                                    <Input
                                        variant='necessary'
                                        placeholder='이름을 입력하세요.'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-subPink-700' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                            <FormItem className='flex w-full flex-col gap-1'>
                                <FormLabel className='text-lg'>
                                    전화번호
                                </FormLabel>
                                <div className='flex w-full gap-2'>
                                    <FormControl>
                                        <Input
                                            variant='necessary'
                                            placeholder="'-'를 제외하고 입력하세요."
                                            inputMode='numeric'
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type='button'
                                        variant='default'
                                        className='whitespace-nowrap'
                                        onClick={handleRequestVerification}
                                    >
                                        인증
                                    </Button>
                                </div>
                                <FormMessage className='text-subPink-700' />

                                {isSent && (
                                    <div className='flex w-full flex-col items-center gap-5'>
                                        <div className='flex w-full flex-col gap-1'>
                                            <p className='text-primary-500 pl-1'>
                                                입력하신 전화번호로 인증번호가
                                                전송되었습니다.
                                            </p>
                                            <p className='text-primary-500 pl-1'>
                                                '로봇이 아닙니다' 체크 후
                                                인증번호를 입력하세요.
                                            </p>
                                            <FormField
                                                control={form.control}
                                                name='code'
                                                render={({ field }) => (
                                                    <FormItem className='flex w-full gap-2'>
                                                        <FormControl>
                                                            <Input
                                                                variant='default'
                                                                placeholder='인증번호를 입력하세요.'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <Button
                                                            type='button'
                                                            variant='default'
                                                            children='확인'
                                                            className='whitespace-nowrap'
                                                            onClick={
                                                                handleVerifyCode
                                                            }
                                                        />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* 인증 결과 메시지 표시 */}
                                            {verificationMessage && (
                                                <p
                                                    className={`pl-1 ${verificationSuccess ? 'text-primary-500' : 'text-subPink-700'}`}
                                                >
                                                    {verificationMessage}
                                                </p>
                                            )}
                                        </div>
                                        <ReCAPTCHA
                                            sitekey={
                                                import.meta.env
                                                    .VITE_RECAPTCHA_SITE_KEY
                                            }
                                            onChange={handleRecaptchaChange}
                                            onExpired={handleRecaptchaExpired}
                                        />
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
};

export default SignatureForm;
