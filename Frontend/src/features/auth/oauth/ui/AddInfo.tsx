import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    requestVerificationCode,
    verifyCode,
} from '@/features/auth/signup/api/signup';
import Header from '@/widgets/layout/header/Header';
import { addProfile } from '../api/addProfile';
import { AdditionalInfo } from '../model/types';

interface PostcodeData {
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    addressType: string;
    buildingName: string;
    apartment: string;
    bname: string;
}

const AddInfo = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const [form, setForm] = useState({
        userName: '',
        phoneNumber: '',
        address: '',
        addressDetail: '',
        certCode: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [phoneVerifyError, setPhoneVerifyError] = useState<string | null>(
        null,
    );
    const [phoneVerifyLoading, setPhoneVerifyLoading] = useState({
        verify: false,
        code: false,
    });

    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        // const code = new URLSearchParams(window.location.search).get('code');

        console.log('code: ', code);
        if (!code) {
            navigate('/');
        } else {
            navigate(window.location.pathname, { replace: true });
        }
    }, [code, navigate]);

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));

        // 전화번호가 변경되면 인증 상태 초기화
        if (key === 'phoneNumber') {
            setIsPhoneVerified(false);
        }
    };

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

    // 인증 코드 요청
    const handleRequestCode = async () => {
        if (
            !form.phoneNumber ||
            !/^01[016789]\d{7,8}$/.test(form.phoneNumber)
        ) {
            setPhoneVerifyError('유효한 휴대폰 번호를 입력해주세요.');
            return;
        }

        setPhoneVerifyLoading((prev) => ({ ...prev, verify: true }));
        setPhoneVerifyError(null);

        try {
            await requestVerificationCode(form.phoneNumber);
            setPhoneVerifyError('인증번호가 발송되었습니다.');
        } catch (error) {
            if (error instanceof Error) {
                const errorObj = error as Error & {
                    response?: { data?: { message?: string } };
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
            setPhoneVerifyLoading((prev) => ({ ...prev, verify: false }));
        }
    };

    // 인증 코드 확인
    const handleVerifyCode = async () => {
        if (!form.certCode) {
            setPhoneVerifyError('인증번호를 입력해주세요.');
            return;
        }

        setPhoneVerifyLoading((prev) => ({ ...prev, code: true }));
        setPhoneVerifyError(null);

        try {
            await verifyCode({
                phoneNumber: form.phoneNumber,
                code: form.certCode,
            });
            setIsPhoneVerified(true);
            setPhoneVerifyError(null);
        } catch (error) {
            setIsPhoneVerified(false);
            if (error instanceof Error) {
                const errorObj = error as Error & {
                    response?: { data?: { message?: string } };
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
            setPhoneVerifyLoading((prev) => ({ ...prev, code: false }));
        }
    };

    const handleSubmit = async () => {
        if (!form.userName || !form.phoneNumber || !form.address) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        if (!isPhoneVerified) {
            setError('휴대폰 인증을 완료해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        const payload: AdditionalInfo = {
            userName: form.userName,
            phoneNumber: form.phoneNumber,
            address: form.address,
            addressDetail: form.addressDetail,
        };

        try {
            await addProfile(payload, token as string);
            navigate('/');
        } catch (e) {
            console.error(e);
            setError('추가 정보 등록 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none relative flex-1 gap-4 overflow-y-auto p-4'>
                <Header title='추가 정보 입력' />

                <div className='mb-4 rounded-lg bg-white p-6 shadow-sm'>
                    {/* 성명 */}
                    <div className='flex flex-col gap-1'>
                        <label>성명</label>
                        <input
                            type='text'
                            value={form.userName}
                            onChange={(e) =>
                                handleChange('userName', e.target.value)
                            }
                            className='border-line-300 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 주소 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>주소</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type='text'
                                placeholder='도로명 주소를 입력하세요.'
                                value={form.address}
                                readOnly
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button onClick={handleOpenPostcode}>
                                도로명 검색
                            </Button>
                        </div>

                        <input
                            id='detailAddress'
                            type='text'
                            placeholder='상세 주소를 입력하세요.'
                            value={form.addressDetail}
                            onChange={(e) =>
                                handleChange('addressDetail', e.target.value)
                            }
                            className='border-line-300 mt-2 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 휴대폰 인증 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>전화번호</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type='tel'
                                placeholder='전화번호를 입력하세요. (- 없이 입력)'
                                value={form.phoneNumber}
                                onChange={(e) =>
                                    handleChange('phoneNumber', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button
                                onClick={handleRequestCode}
                                disabled={phoneVerifyLoading.verify}
                            >
                                {phoneVerifyLoading.verify
                                    ? '요청 중...'
                                    : '인증'}
                            </Button>
                        </div>

                        <div className='mt-2 flex items-center gap-1'>
                            <input
                                type='text'
                                placeholder='인증 번호를 입력하세요.'
                                value={form.certCode}
                                onChange={(e) =>
                                    handleChange('certCode', e.target.value)
                                }
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button
                                onClick={handleVerifyCode}
                                disabled={phoneVerifyLoading.code}
                            >
                                {phoneVerifyLoading.code
                                    ? '확인 중...'
                                    : '확인'}
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

                    {error && (
                        <div className='mt-4 rounded-md border border-red-200 bg-red-50 p-3'>
                            <p className='text-sm text-red-500'>{error}</p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    variant={
                        form.userName &&
                        form.phoneNumber &&
                        form.address &&
                        isPhoneVerified &&
                        !isLoading
                            ? 'primary'
                            : 'primaryDisabled'
                    }
                    className='w-full'
                >
                    {isLoading ? '처리 중...' : '완료'}
                </Button>
            </div>
        </div>
    );
};

export default AddInfo;
