import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NoticeModal, ToastModal } from '@/widgets';

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
        <div className='flex h-screen flex-col'>
            {/* 상단 영역 */}
            <div className='p-6'>
                <h2 className='mt-8 text-center text-lg font-semibold'>
                    {step === 'input' ? '결제 비밀번호' : '비밀번호 확인'}
                </h2>
                <p className='text-line-500 text-center'>
                    {step === 'input'
                        ? '결제 비밀번호를 입력하세요'
                        : '확인을 위해 한 번 더 입력해주세요'}
                </p>

                {/* 비밀번호 시각화 */}
                <div className='mt-10 mb-8 flex justify-center gap-3'>
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-8 w-8 border-b-1 text-center text-2xl font-semibold ${
                                inputValue[idx]
                                    ? 'border-primary-500'
                                    : 'border-line-200'
                            }`}
                        >
                            {inputValue[idx] ? '•' : ''}
                        </div>
                    ))}
                </div>
            </div>

            {/* 숫자패드 + 버튼 */}
            <div className='fixed bottom-0 left-0 w-full px-6 pb-6'>
                {/* 숫자 키패드 */}
                <div className='mb-10 grid grid-cols-3 gap-8 text-center text-2xl'>
                    {[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '',
                        '0',
                        '←',
                    ].map((num) =>
                        num === '←' ? (
                            <div
                                key={num}
                                onClick={handleDelete}
                                className='cursor-pointer'
                            >
                                ←
                            </div>
                        ) : (
                            <div
                                key={num}
                                onClick={() => handleNumberClick(num)}
                                className='cursor-pointer'
                            >
                                {num}
                            </div>
                        ),
                    )}
                </div>

                {/* 하단 버튼 */}
                <Button
                    variant='primary'
                    onClick={handleSubmit}
                    disabled={inputValue.length < 6}
                >
                    확인
                </Button>
            </div>

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
    );
};

export default AccountPasswordForm;
