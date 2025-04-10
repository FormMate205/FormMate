import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { queryClient } from '@/app/provider/queryClient';
import { Button } from '@/components/ui/button';
import { usePutRegisterAccount } from '@/entities/account/api/registerAccount';
import { useAccountStore } from '@/entities/account/model/accountStore';
import { useUserStore } from '@/entities/user/model/userStore';
import NumberPad from '@/shared/ui/NumberPad';
import PasswordDots from '@/shared/ui/PasswordDots';
import { Header, NoticeModal, ToastModal } from '@/widgets';
import { ErrorResponse } from '@/widgets/modal/types';

const AccountPasswordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setHasAccount = useUserStore((state) => state.setHasAccount);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    const { verificationCode, bankName, accountNumber } = location.state || {};

    // 계좌 정보가 없을 시 계좌 등록 페이지로 이동
    const handleNotRegisterAccount = (error: AxiosError<ErrorResponse>) => {
        const message = error.response?.data.message;

        if (message == '계좌 정보를 찾을 수 없습니다.') {
            navigate('/account');
            return;
        }
    };

    // 계좌 등록 API
    const { mutate: registerAccount } = usePutRegisterAccount(
        handleNotRegisterAccount,
    );

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
                    registerAccount({
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
                } catch (err) {
                    console.error('계좌 등록 실패:', err);
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
        <div className='flex flex-col h-screen overflow-hidden'>
            <div className='flex flex-col flex-1 gap-2 px-4 py-2 pb-64 overflow-y-auto scrollbar-none'>
                <Header title='결제 비밀번호 등록' />

                <div className='flex flex-col justify-center p-6'>
                    <h2 className='text-xl font-semibold text-center'>
                        {step === 'input' ? '결제 비밀번호' : '비밀번호 확인'}
                    </h2>
                    <p className='text-center text-line-500'>
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

            <div className='bottom-0 left-0 w-full p-6 bg-white'>
                <div className='flex flex-col w-full gap-6 mx-auto'>
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
