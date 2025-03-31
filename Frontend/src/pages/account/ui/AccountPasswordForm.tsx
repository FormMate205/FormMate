import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NumberPad from '@/shared/ui/NumberPad';
import PasswordDots from '@/shared/ui/PasswordDots';
import { Header, NoticeModal, ToastModal } from '@/widgets';

const AccountPasswordForm = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<'input' | 'confirm'>('input');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [showFailModal, setShowFailModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleNumberClick = (num: string) => {
        if (inputValue.length >= 6) return;
        setInputValue((prev) => prev + num);
    };

    const handleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (step === 'input') {
            if (inputValue.length === 6) {
                setPassword(inputValue);
                setInputValue('');
                setStep('confirm');
            }
        } else if (step === 'confirm') {
            if (inputValue === password) {
                // 성공
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate('/');
                }, 1500);
            } else {
                // 실패
                setShowFailModal(true);
                setInputValue('');
            }
        }
    };

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='scrollbar-none flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-2 pb-64'>
                <Header title='결제 비밀번호 등록' />

                <div className='flex flex-col justify-center p-6'>
                    <h2 className='text-center text-xl font-semibold'>
                        {step === 'input' ? '결제 비밀번호' : '비밀번호 확인'}
                    </h2>
                    <p className='text-line-500 text-center'>
                        {step === 'input'
                            ? '결제 비밀번호를 입력하세요'
                            : '확인을 위해 한 번 더 입력해주세요'}
                    </p>
                    <PasswordDots inputValue={inputValue} />

                    {/* 실패 모달 */}
                    <NoticeModal
                        isOpen={showFailModal}
                        title='비밀번호 불일치'
                        description='비밀번호가 일치하지 않습니다.'
                        onClose={() => setShowFailModal(false)}
                    />

                    {/* 성공 모달 */}
                    <ToastModal
                        isOpen={showSuccess}
                        title='계좌 등록이 완료되었습니다'
                    />
                </div>
            </div>

            {/* 숫자패드 + 버튼 - 고정 위치로 변경 */}
            <div className='bottom-0 left-0 w-full bg-white p-6'>
                <div className='mx-auto flex w-full flex-col gap-6'>
                    {/* 숫자 키패드 */}
                    <NumberPad
                        onDelete={handleDelete}
                        onNumberClick={handleNumberClick}
                    />

                    {/* 하단 버튼 */}
                    <Button
                        variant='primary'
                        onClick={handleSubmit}
                        disabled={inputValue.length < 6}
                    >
                        확인
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccountPasswordForm;
