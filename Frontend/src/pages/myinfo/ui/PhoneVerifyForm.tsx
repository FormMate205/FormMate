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

    return (
        //relative flex min-h-screen flex-col
        <div className='relative flex h-screen flex-col overflow-hidden'>
            <Header title='비밀번호 찾기' />
            <div className='scrollbar-none flex h-full flex-col gap-6 overflow-y-auto p-6'>
                <h2 className='text-xl font-semibold'>전화번호로 인증하기</h2>

                {/* 전화번호 입력 */}
                <div className='flex items-center gap-2'>
                    <input
                        type='tel'
                        placeholder="전화번호 입력 ('-' 제외)"
                        className='f-0 focus:outline-noneocus:ring border-line-300 min-w-0 flex-1 border-b px-2 py-3'
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
                    className={`border-b px-2 py-3 ${isFailed ? 'border-subPink-500)]' : 'border-line-300'}`}
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
                        variant={'primary'}
                        className={`${isCodeValid ? 'bg-primary-500 text-white' : 'bg-line-300 text-line-700'} w-full py-3`}
                        onClick={() => isCodeValid && navigate('/')}
                    >
                        본인 인증
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PhoneVerifyForm;
