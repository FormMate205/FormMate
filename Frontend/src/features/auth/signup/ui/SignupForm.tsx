import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/widgets/layout/header/Header';
import {
    checkEmail,
    requestVerificationCode,
    verifyCode,
    registerUser,
} from '../api/signup';
import { useSignupForm } from '../model/signupFormStore';
import {
    RegisterUserRequest,
    ApiErrorResponse,
    SignupFormState,
} from '../model/types';

const SignupForm = () => {
    const navigate = useNavigate();

    // Zustand 스토어 사용
    const {
        name,
        email,
        password,
        confirmPassword,
        phone,
        address,
        detailAddress,
        certCode,
        isEmailChecked,
        isPhoneVerified,
        setField,
        isFormValid,
        resetForm,
    } = useSignupForm();

    const [isLoading, setIsLoading] = useState({
        email: false,
        verify: false,
        code: false,
        submit: false,
    });

    const [errors, setErrors] = useState<string | null>(null);
    const [phoneVerifyError, setPhoneVerifyError] = useState<string | null>(
        null,
    );
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // 비밀번호 유효성 검사
    const validatePassword = (password: string): boolean => {
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // 특정 필드의 값을 업데이트
    const handleChange = <K extends keyof SignupFormState>(
        key: K,
        value: string,
    ) => {
        setField(key, value);

        // 비밀번호 필드가 변경되면 유효성 검사 실행
        if (key === 'password') {
            if (!value) {
                setPasswordError(null);
            } else if (!validatePassword(value)) {
                setPasswordError(
                    '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.',
                );
            } else {
                setPasswordError(null);
            }
        }
    };

    // 다음 주소 검색
    const handleOpenPostcode = () => {
        if (window.daum?.Postcode) {
            new window.daum.Postcode({
                oncomplete: (data: PostcodeData) => {
                    handleChange('address', data.roadAddress);
                    setTimeout(() => {
                        document.getElementById('detailAddress')?.focus();
                    }, 0);
                },
            }).open();
        } else {
            const script = document.createElement('script');
            script.src =
                '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.onload = () => handleOpenPostcode();
            document.body.appendChild(script);
        }
    };

    // 이메일 중복 확인
    const handleCheckEmail = async () => {
        if (
            !email ||
            !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)
        ) {
            setEmailError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setIsLoading((prev) => ({ ...prev, email: true }));
        setEmailError(null);

        try {
            const isAvailable = await checkEmail(email);
            setField('isEmailChecked', isAvailable);

            if (!isAvailable) {
                setEmailError('이미 사용 중인 이메일입니다.');
            }
        } catch (error) {
            console.error('이메일 확인 오류:', error);
            setEmailError('이메일 확인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading((prev) => ({ ...prev, email: false }));
        }
    };

    // 인증 코드 요청
    const handleRequestCode = async () => {
        if (!phone || !/^01[016789]\d{7,8}$/.test(phone)) {
            setPhoneVerifyError('유효한 휴대폰 번호를 입력해주세요.');
            return;
        }

        setIsLoading((prev) => ({ ...prev, verify: true }));
        setPhoneVerifyError(null);

        try {
            await requestVerificationCode(phone);
            setPhoneVerifyError('인증번호가 발송되었습니다.');
        } catch (error) {
            if (error instanceof Error) {
                const errorObj = error as Error & {
                    response?: { data?: ApiErrorResponse };
                };
                const apiError = errorObj.response?.data;
                setPhoneVerifyError(
                    apiError && apiError.message
                        ? apiError.message
                        : '인증번호 요청 중 오류가 발생했습니다.',
                );
            } else {
                setPhoneVerifyError('인증번호 요청 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading((prev) => ({ ...prev, verify: false }));
        }
    };

    // 인증 코드 확인
    const handleVerifyCode = async () => {
        if (!certCode) {
            setPhoneVerifyError('인증번호를 입력해주세요.');
            return;
        }

        setIsLoading((prev) => ({ ...prev, code: true }));
        setPhoneVerifyError(null);

        try {
            await verifyCode({ phoneNumber: phone, code: certCode });
            setField('isPhoneVerified', true);
            setPhoneVerifyError(null);
        } catch (error) {
            setField('isPhoneVerified', false);
            if (error instanceof Error) {
                const errorObj = error as Error & {
                    response?: { data?: ApiErrorResponse };
                };
                const apiError = errorObj.response?.data;
                setPhoneVerifyError(
                    apiError && apiError.message
                        ? apiError.message
                        : '인증번호 확인 중 오류가 발생했습니다.',
                );
            } else {
                setPhoneVerifyError('인증번호 확인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading((prev) => ({ ...prev, code: false }));
        }
    };

    // 회원가입 제출
    const handleSignup = async () => {
        if (!isEmailChecked) {
            setErrors('이메일 중복 확인을 완료해주세요.');
            return;
        }

        if (!isPhoneVerified) {
            setErrors('휴대폰 인증을 완료해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setErrors('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 비밀번호 유효성 확인 - 이미 실시간으로 검사하고 있으므로 재확인
        if (!validatePassword(password)) {
            setErrors('비밀번호 형식이 올바르지 않습니다.');
            return;
        }

        if (!isFormValid()) {
            setErrors('모든 필드를 입력해주세요.');
            return;
        }

        setIsLoading((prev) => ({ ...prev, submit: true }));
        setErrors(null);

        const payload: RegisterUserRequest = {
            email,
            password,
            userName: name,
            phoneNumber: phone,
            address,
            addressDetail: detailAddress,
            provider: 'LOCAL',
        };

        try {
            await registerUser(payload);
            resetForm(); // 폼 초기화
            navigate('/login');
        } catch (error) {
            if (error instanceof Error) {
                const errorObj = error as Error & {
                    response?: { data?: ApiErrorResponse };
                };
                const apiError = errorObj.response?.data;

                if (apiError && apiError.errors && apiError.errors.length > 0) {
                    // 필드별 오류 처리
                    const fieldErrors = apiError.errors
                        .map((err) => `${err.field}: ${err.reason}`)
                        .join('\n');
                    setErrors(fieldErrors);
                } else {
                    setErrors(
                        apiError?.message || '회원가입 중 오류가 발생했습니다.',
                    );
                }
            } else {
                setErrors('회원가입 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading((prev) => ({ ...prev, submit: false }));
        }
    };

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none relative flex-1 gap-4 overflow-y-auto p-4'>
                <Header title='회원가입' />

                <div className='mb-4 rounded-lg bg-white p-6 shadow-sm'>
                    {/* 성명 */}
                    <div className='flex flex-col gap-1'>
                        <label className='font-weight-regular text-font-size-text-md'>
                            성명
                        </label>
                        <input
                            id='name'
                            type='text'
                            placeholder='성명을 입력하세요.'
                            value={name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                            className='border-line-300 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 이메일 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>이메일</label>
                        <div className='flex items-center gap-1'>
                            <input
                                id='email'
                                type='email'
                                placeholder='이메일을 입력하세요.'
                                value={email}
                                onChange={(e) =>
                                    handleChange('email', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button
                                onClick={handleCheckEmail}
                                disabled={isLoading.email}
                            >
                                {isLoading.email ? '확인 중...' : '중복 확인'}
                            </Button>
                        </div>

                        {isEmailChecked && (
                            <p className='text-primary-500 mt-1 text-sm'>
                                ✓ 사용 가능한 이메일입니다.
                            </p>
                        )}
                        {emailError && (
                            <p className='text-subPink-700 mt-1 text-sm'>
                                ✖ {emailError}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>비밀번호</label>
                        <input
                            id='password'
                            type='password'
                            placeholder='비밀번호를 입력하세요. (8자 이상, 영문/숫자/특수문자 포함)'
                            value={password}
                            onChange={(e) =>
                                handleChange('password', e.target.value)
                            }
                            className='border-line-300 rounded border px-4 py-2 text-sm'
                        />
                        {passwordError && (
                            <p className='text-subPink-700 mt-1 text-sm'>
                                ✖ {passwordError}
                            </p>
                        )}
                        {password && !passwordError && (
                            <p className='text-primary-500 mt-1 text-sm'>
                                ✓ 사용 가능한 비밀번호입니다.
                            </p>
                        )}

                        <input
                            id='confirmPassword'
                            type='password'
                            placeholder='비밀번호를 한 번 더 입력하세요.'
                            value={confirmPassword}
                            onChange={(e) =>
                                handleChange('confirmPassword', e.target.value)
                            }
                            className='border-line-300 mt-2 rounded border px-4 py-2 text-sm'
                        />
                        {password &&
                            confirmPassword &&
                            password !== confirmPassword && (
                                <p className='text-subPink-700 mt-1 text-sm'>
                                    ✖ 비밀번호가 일치하지 않습니다.
                                </p>
                            )}
                        {password &&
                            confirmPassword &&
                            password === confirmPassword &&
                            password !== '' && (
                                <p className='text-primary-500 mt-1 text-sm'>
                                    ✓ 비밀번호가 일치합니다.
                                </p>
                            )}
                    </div>

                    {/* 주소 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>주소</label>
                        <div className='flex items-center gap-1'>
                            <input
                                id='address'
                                type='text'
                                placeholder='도로명 주소를 입력하세요.'
                                value={address}
                                onChange={(e) =>
                                    handleChange('address', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                                readOnly
                            />
                            <Button onClick={handleOpenPostcode}>
                                도로명 검색
                            </Button>
                        </div>

                        <input
                            id='detailAddress'
                            type='text'
                            placeholder='상세 주소를 입력하세요.'
                            value={detailAddress}
                            onChange={(e) =>
                                handleChange('detailAddress', e.target.value)
                            }
                            className='border-line-300 mt-2 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 휴대폰 인증 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>전화번호</label>
                        <div className='flex items-center gap-1'>
                            <input
                                id='phone'
                                type='tel'
                                placeholder='전화번호를 입력하세요.'
                                value={phone}
                                onChange={(e) =>
                                    handleChange('phone', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button
                                onClick={handleRequestCode}
                                disabled={isLoading.verify}
                            >
                                {isLoading.verify ? '요청 중...' : '인증'}
                            </Button>
                        </div>

                        <div className='mt-2 flex items-center gap-1'>
                            <input
                                id='certCode'
                                type='text'
                                placeholder='인증 번호를 입력하세요.'
                                value={certCode}
                                onChange={(e) =>
                                    handleChange('certCode', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button
                                onClick={handleVerifyCode}
                                disabled={isLoading.code}
                            >
                                {isLoading.code ? '확인 중...' : '확인'}
                            </Button>
                        </div>

                        {isPhoneVerified && (
                            <p className='text-primary-500 mt-1 text-sm'>
                                ✓ 인증이 완료되었습니다.
                            </p>
                        )}
                        {phoneVerifyError && (
                            <p
                                className={`mt-1 text-sm ${phoneVerifyError === '인증번호가 발송되었습니다.' ? 'text-primary-500' : 'text-subPink-700'}`}
                            >
                                {phoneVerifyError ===
                                '인증번호가 발송되었습니다.'
                                    ? '✓'
                                    : '✖'}{' '}
                                {phoneVerifyError}
                            </p>
                        )}
                    </div>

                    {/* 에러 메시지 */}
                    {errors && (
                        <div className='mt-4 rounded-md border border-red-200 bg-red-50 p-3'>
                            <p className='text-sm whitespace-pre-line text-red-500'>
                                {errors}
                            </p>
                        </div>
                    )}
                </div>

                {/* 회원가입 버튼 */}
                <Button
                    onClick={handleSignup}
                    disabled={isLoading.submit || !isFormValid()}
                    variant={
                        isFormValid() && !isLoading.submit
                            ? 'primary'
                            : 'primaryDisabled'
                    }
                    className='w-full'
                >
                    {isLoading.submit ? '처리 중...' : '회원가입'}
                </Button>
            </div>
        </div>
    );
};

export default SignupForm;
