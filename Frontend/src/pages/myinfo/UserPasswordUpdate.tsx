import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/shared/api/instance';
import { Header, ToastModal } from '@/widgets';

const UserPasswordUpdate = () => {
    const navigate = useNavigate();
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [toastOpen, setToastOpen] = useState(false);
    const [errors, setErrors] = useState({
        currentPw: '',
        newPw: '',
        confirmPw: '',
    });
    const isFormValid = currentPw && newPw && confirmPw;

    const handleSubmit = async () => {
        try {
            setErrors({ currentPw: '', newPw: '', confirmPw: '' });

            await api.put('/users/password', {
                password: currentPw,
                newPassword: newPw,
                confirmPassword: confirmPw,
            });
            setToastOpen(true);
            setTimeout(() => {
                setToastOpen(false);
                navigate('/');
            }, 2000);
        } catch (error: unknown) {
            const err = error as AxiosError<{
                status: number;
                message: string;
                errors: { field: string; value: string; reason: string }[];
            }>;
            const { message, errors: detailErrors = [] } =
                err.response?.data || {};

            if (message === '현재 비밀번호가 올바르지 않습니다') {
                setErrors((prev) => ({
                    ...prev,
                    currentPw: '현재 비밀번호가 올바르지 않습니다.',
                }));
            } else if (message === '새 비밀번호가 일치하지 않습니다') {
                setErrors((prev) => ({
                    ...prev,
                    confirmPw: '새 비밀번호가 일치하지 않습니다.',
                }));
            } else if (
                message === '잘못된 입력값입니다' &&
                detailErrors.length > 0
            ) {
                detailErrors.forEach(({ field, reason }) => {
                    if (field === 'newPassword') {
                        setErrors((prev) => ({
                            ...prev,
                            newPw: reason,
                        }));
                    }
                });
            } else {
                alert(message || '알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className='relative flex min-h-screen flex-col px-4 py-2'>
            <Header title='비밀번호 변경'></Header>
            <div className='mt-6'>
                <label className='mb-2 block text-sm'>
                    기존 비밀번호를 입력하세요
                </label>
                <input
                    type='password'
                    placeholder='비밀번호 입력'
                    className='border-line-400 mb-4 w-full border-b py-2'
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                />
                {errors.currentPw && (
                    <p className='text-subPink-700 mb-2 text-sm'>
                        {errors.currentPw}
                    </p>
                )}

                <div className='text-right'>
                    <button
                        className='text-line-500 mb-6 text-right text-sm underline'
                        onClick={() => navigate('/myinfo/password/findPw')}
                    >
                        비밀번호를 잊으셨나요?
                    </button>
                </div>

                <label className='border-line-400 my-2 block text-sm'>
                    새 비밀번호를 입력하세요
                </label>
                <input
                    type='password'
                    placeholder='새 비밀번호 입력'
                    className='border-line-400 mb-4 w-full border-b py-2'
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='새 비밀번호 확인'
                    className='border-line-400 mb-8 w-full border-b py-2'
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                />
                {errors.newPw && (
                    <p className='text-subPink-700 mb-4 text-sm'>
                        {errors.newPw}
                    </p>
                )}
                {errors.confirmPw && (
                    <p className='text-subPink-700 mb-8 text-sm'>
                        {errors.confirmPw}
                    </p>
                )}
            </div>
            <div className='absolute bottom-0 left-0 w-full bg-white p-6'>
                <Button
                    variant={isFormValid ? 'primary' : 'primaryDisabled'}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className='w-full'
                >
                    비밀번호 변경
                </Button>
            </div>

            <ToastModal isOpen={toastOpen} title='비밀번호 변경 완료' />
        </div>
    );
};

export default UserPasswordUpdate;
