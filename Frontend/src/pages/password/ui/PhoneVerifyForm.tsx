import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const PhoneVerifyForm = () => {
    // 인증여부는 임시로 하드코딩 상태
    const isPhoneValid = true;
    const isCodeValid = true;
    const isFailed = false;
    const failCount = 0; // 최대 3회 (?)

    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [certCode, setCertCode] = useState('');

    const isCertValid = certCode.length === 6; // 6자리 입력했을 때 활성화

    return (
        <div className='relative flex h-screen flex-col gap-6 p-6'>
            <Header title='비밀번호 찾기' />

            <h2 className='text-xl font-semibold'>전화번호로 인증하기</h2>

            {/* 전화번호 입력 */}
            <div className='flex items-center gap-2'>
                <input
                    type='tel'
                    placeholder="전화번호 입력 ('-' 제외)"
                    className='border-line-300 min-w-0 flex-1 border-b px-2 py-3'
                    value={phoneNumber}
                    maxLength={11}
                    onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))
                    }
                />
                <Button
                    variant={'choiceFill'}
                    className={`${isPhoneValid ? 'bg-primary-500 text-white' : 'bg-line-300 text-line-700'} w-auto px-4`}
                >
                    인증 요청
                </Button>
            </div>

            {/* 인증번호 입력 */}
            <input
                type='text'
                placeholder='인증번호 입력'
                maxLength={6}
                className={`border-b px-2 py-3 ${isFailed ? 'border-subPink-500' : 'border-line-300'}`}
                value={certCode}
                onChange={(e) =>
                    setCertCode(e.target.value.replace(/[^0-9]/g, ''))
                }
            />

            {/* 인증 실패 카운트 */}
            <p
                className={`${isFailed ? 'text-subPink-500)]' : 'text-line-300'} pl-2`}
            >
                {isFailed ? `${failCount}/3` : `${failCount}/3`}
            </p>

            <div className='absolute bottom-0 left-0 w-full gap-6 p-6'>
                {/* 본인 인증 버튼 */}
                <Button
                    variant={isCertValid ? 'primary' : 'primaryDisabled'}
                    className='w-full py-3'
                    onClick={() =>
                        isCertValid && navigate('/login/findPw/reset')
                    }
                    disabled={!isCertValid}
                >
                    본인 인증
                </Button>
            </div>
        </div>
    );
};

export default PhoneVerifyForm;
