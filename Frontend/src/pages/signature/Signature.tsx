import ReCAPTCHA from 'react-google-recaptcha';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useSignature } from '@/features/signature/model/useSignature';
import ConfirmModal from '@/widgets/modal/ConfirmModal';

const Signature = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formId, type, creditorId, requestedById } = location.state;

    // 입력 및 인증 상태 관리
    const {
        form,
        verificationMessage,
        verificationSuccess,
        requestMessage,
        requestSuccess,
        handleRequestVerification,
        handleVerifyCode,
        handleRecaptchaChange,
        handleRecaptchaExpired,
    } = useSignature({ formId, type, creditorId, requestedById });

    return (
        <div className='flex flex-col w-full h-screen px-4 py-2'>
            <div className='h-full py-4'>
                <p className='text-2xl font-semibold'>FormMate 전자 서명</p>
                <Form {...form}>
                    <form className='flex flex-col gap-4 mt-10 mb-5'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='flex flex-col w-full gap-1'>
                                    <FormLabel className='text-lg'>
                                        성명
                                    </FormLabel>
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
                                <FormItem className='flex flex-col w-full gap-1'>
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
                                            children='인증'
                                            className='whitespace-nowrap'
                                            onClick={handleRequestVerification}
                                        />
                                    </div>
                                    <FormMessage className='text-subPink-700' />

                                    {requestSuccess && (
                                        <div className='flex flex-col items-center w-full gap-5'>
                                            <div className='flex flex-col w-full gap-1'>
                                                <p
                                                    className={`pl-1 ${requestSuccess ? 'text-primary-500' : 'text-subPink-700'}`}
                                                >
                                                    {requestMessage}
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <p
                                                    className={`pl-1 ${verificationSuccess ? 'text-primary-500' : 'text-subPink-700'}`}
                                                >
                                                    {verificationMessage}
                                                </p>

                                                {verificationMessage ===
                                                    '잔액이 부족합니다.' && (
                                                    <ConfirmModal
                                                        description='잔액이 부족하여 계약 체결이 불가능합니다.'
                                                        title='잔액 충전 후 재서명 해주세요.'
                                                        open={true}
                                                        onConfirm={() =>
                                                            navigate(
                                                                `/chat/${formId}`,
                                                                {
                                                                    state: {
                                                                        isFin: false,
                                                                    },
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <ReCAPTCHA
                                                sitekey={
                                                    import.meta.env
                                                        .VITE_RECAPTCHA_SITE_KEY
                                                }
                                                onChange={handleRecaptchaChange}
                                                onExpired={
                                                    handleRecaptchaExpired
                                                }
                                            />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
            <div className='flex gap-2'>
                <Button
                    type='button'
                    variant='choiceEmpty'
                    children='닫기'
                    className='w-full'
                    onClick={() =>
                        navigate(`/chat/${formId}`, { state: { isFin: false } })
                    }
                />
                <Button
                    type='button'
                    variant='choiceFill'
                    children='확인'
                    className='w-full'
                    onClick={handleVerifyCode}
                />
            </div>
        </div>
    );
};

export default Signature;
