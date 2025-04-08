import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/shared/api/instance';
import { Header, ToastModal } from '@/widgets';

const PhoneVerifyForm = () => {
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const [phoneError, setPhoneError] = useState('');
    const [codeError, setCodeError] = useState('');
    const [codeSuccess, setCodeSuccess] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const validatePassword = (password: string) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            password,
        );
    };

    // 인증 요청
    const handleRequestCode = async () => {
        try {
            setPhoneError('');
            setRequestSuccess('');
            setCodeSuccess('');
            await api.post('/auth/password/find', {
                userName,
                phoneNumber,
            });
            setRequestSent(true);
            setRequestSuccess('✓ 인증번호가 발송되었습니다.');
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg = err.response?.data?.message;

            if (msg === '올바른 휴대폰 번호 형식이 아닙니다') {
                setPhoneError('올바른 휴대폰 번호 형식이 아닙니다.');
            } else if (msg === '사용자를 찾을 수 없습니다') {
                setPhoneError('입력한 정보로 가입된 사용자가 없습니다.');
            } else {
                setPhoneError('인증 요청 중 오류가 발생했습니다.');
            }
        }
    };

    // 인증 확인
    const handleVerifyCode = async () => {
        try {
            setCodeError('');
            setCodeSuccess('');
            await api.post('/auth/password/verify', {
                phoneNumber,
                verificationCode,
            });
            setIsCodeVerified(true);
            setCodeSuccess('✓ 인증이 완료되었습니다.');
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg = err.response?.data?.message;

            if (msg === '휴대전화 인증에 실패했습니다') {
                setCodeError('인증번호가 올바르지 않습니다.');
            } else if (msg === '사용자를 찾을 수 없습니다') {
                setCodeError('가입된 사용자가 없습니다.');
            } else {
                setCodeError('인증 확인 중 오류가 발생했습니다.');
            }
        }
    };

    // 새 비밀번호 수정
    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);
        if (!validatePassword(value)) {
            setNewPasswordError(
                '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.',
            );
        } else {
            setNewPasswordError('');
        }

        // 확인 비밀번호도 함께 비교
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (value !== newPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError('');
        }
    };

    // 새 비밀번호 적용
    const handleResetPassword = async () => {
        if (newPasswordError || confirmPasswordError) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        try {
            await api.post('/auth/password/reset', {
                phoneNumber,
                newPassword,
                confirmPassword,
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            navigate('/');
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg = err.response?.data?.message;
            setSubmitError(msg || '비밀번호 변경에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPasswordValid =
        validatePassword(newPassword) &&
        newPassword === confirmPassword &&
        !newPasswordError &&
        !confirmPasswordError;

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='scrollbar-none relative w-full flex-1 overflow-y-auto px-4 py-2'>
                <Header title='비밀번호 찾기' />

                <h2 className='my-6 gap-6 text-xl font-semibold'>
                    전화번호로 인증하기
                </h2>

                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        {/* 이름 입력 */}
                        <input
                            type='text'
                            placeholder='이름 입력'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className='border-line-300 w-full border-b px-2 py-3'
                            disabled={isCodeVerified}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        {/* 전화번호 입력 */}
                        <input
                            type='tel'
                            placeholder="전화번호 입력 ('-' 제외)"
                            className='border-line-300 min-w-0 flex-1 border-b px-2 py-3'
                            value={phoneNumber}
                            maxLength={11}
                            onChange={(e) =>
                                setPhoneNumber(
                                    e.target.value.replace(/[^0-9]/g, ''),
                                )
                            }
                            disabled={isCodeVerified}
                        />
                        <Button
                            variant={'choiceFill'}
                            className='w-auto px-4'
                            onClick={handleRequestCode}
                            disabled={isCodeVerified}
                        >
                            인증 요청
                        </Button>
                    </div>

                    {/* 인증번호 입력 */}
                    {requestSent && (
                        <div className='flex items-center gap-2'>
                            <input
                                type='text'
                                placeholder='인증번호 입력'
                                maxLength={6}
                                className={`min-w-0 flex-1 border-b px-2 py-3 ${codeError ? 'border-subPink-700' : 'border-line-300'}`}
                                value={verificationCode}
                                onChange={(e) =>
                                    setVerificationCode(
                                        e.target.value.replace(/[^0-9]/g, ''),
                                    )
                                }
                                disabled={isCodeVerified}
                            />
                            <Button
                                variant='choiceFill'
                                className='w-auto px-4'
                                onClick={handleVerifyCode}
                                disabled={
                                    verificationCode.length !== 6 ||
                                    isCodeVerified
                                }
                            >
                                {isCodeVerified ? '인증 완료' : '인증하기'}
                            </Button>
                        </div>
                    )}

                    {codeSuccess ? (
                        <p className='text-primary-500 pl-2 text-sm'>
                            {codeSuccess}
                        </p>
                    ) : requestSuccess ? (
                        <p className='text-primary-500 pl-2 text-sm'>
                            {requestSuccess}
                        </p>
                    ) : null}

                    {codeError ? (
                        <p className='text-primary-500 pl-2 text-sm'>
                            {codeError}
                        </p>
                    ) : phoneError ? (
                        <p className='text-primary-500 pl-2 text-sm'>
                            {phoneError}
                        </p>
                    ) : null}
                </div>

                <div className='absolute bottom-0 left-0 w-full gap-6 p-6'>
                    {isCodeVerified ? (
                        <Button
                            className='w-full py-3'
                            variant={
                                isPasswordValid ? 'primary' : 'primaryDisabled'
                            }
                            disabled={!isPasswordValid || isSubmitting}
                            onClick={handleResetPassword}
                        >
                            {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                        </Button>
                    ) : null}
                </div>

                {isCodeVerified && (
                    <>
                        <h3 className='text-md mt-10 font-semibold'>
                            새 비밀번호 설정
                        </h3>
                        <div className='mt-2 flex flex-col gap-3'>
                            <input
                                type='password'
                                placeholder='새 비밀번호 입력'
                                className='border-line-300 border-b px-2 py-3'
                                value={newPassword}
                                onChange={(e) =>
                                    handleNewPasswordChange(e.target.value)
                                }
                            />
                            <input
                                type='password'
                                placeholder='비밀번호 확인'
                                className='border-line-300 border-b px-2 py-3'
                                value={confirmPassword}
                                onChange={(e) =>
                                    handleConfirmPasswordChange(e.target.value)
                                }
                            />
                            {newPasswordError && (
                                <p className='text-subPink-700 pl-2 text-sm'>
                                    {newPasswordError}
                                </p>
                            )}
                            {confirmPasswordError && (
                                <p className='text-subPink-700 pl-2 text-sm'>
                                    {confirmPasswordError}
                                </p>
                            )}
                        </div>
                        {submitError && (
                            <p className='text-subPink-700 pl-2 text-sm'>
                                {submitError}
                            </p>
                        )}

                        <ToastModal
                            isOpen={showToast}
                            title='비밀번호가 성공적으로 변경되었습니다.'
                        ></ToastModal>
                    </>
                )}
            </div>
        </div>
    );
};

export default PhoneVerifyForm;
