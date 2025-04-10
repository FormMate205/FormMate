import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { queryClient } from '@/app/provider/queryClient';
import { Button } from '@/components/ui/button';
import { registerAccount } from '@/entities/account/api/registerAccount';
import { useAccountStore } from '@/entities/account/model/accountStore';
import { useUserStore } from '@/entities/user/model/userStore';
import NumberPad from '@/shared/ui/NumberPad';
import PasswordDots from '@/shared/ui/PasswordDots';
import { Header, NoticeModal, ToastModal } from '@/widgets';

const AccountPasswordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setHasAccount = useUserStore((state) => state.setHasAccount);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    const { verificationCode, bankName, accountNumber } = location.state || {};

    const [step, setStep] = useState<'input' | 'confirm'>('input');
    const [password, setPassword] = useState('');
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

    const handleSubmit = async () => {
        if (step === 'input') {
            if (inputValue.length === 6) {
                setPassword(inputValue);
                setInputValue('');
                setStep('confirm');
            }
        } else if (step === 'confirm') {
            if (inputValue === password) {
                try {
                    await registerAccount({
                        verificationCode,
                        bankName,
                        accountNumber,
                        accountPassword: inputValue,
                    });
                    setHasAccount(true);
                    setShowSuccess(true);
                    setAccountInfo({
                        hasAccount: true,
                        bankName,
                        accountNumber,
                    });
                    queryClient.invalidateQueries({ queryKey: ['user'] });
                    setTimeout(() => {
                        setShowSuccess(false);
                        navigate('/');
                    }, 1500);
                } catch {
                    setShowFailModal(true);
                    setInputValue('');
                }
            } else {
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

                    <NoticeModal
                        isOpen={showFailModal}
                        title='실패'
                        description='비밀번호가 일치하지 않거나 계좌 등록에 실패했습니다.'
                        onClose={() => setShowFailModal(false)}
                    />

                    <ToastModal
                        isOpen={showSuccess}
                        title='계좌 등록이 완료되었습니다'
                    />
                </div>
            </div>

            <div className='bottom-0 left-0 w-full bg-white p-6'>
                <div className='mx-auto flex w-full flex-col gap-6'>
                    <NumberPad
                        onDelete={handleDelete}
                        onNumberClick={handleNumberClick}
                    />
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
