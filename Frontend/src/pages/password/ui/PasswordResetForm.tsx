import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const PasswordResetForm = () => {
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const navigate = useNavigate();

    const isFormValid = newPw && confirmPw;

    return (
        <div className='relative h-screen flex-col justify-between'>
            <div className='scrollbar-none w-full flex-1 overflow-y-auto px-4 py-2'>
                <Header title='비밀번호 변경' />
                <div className='my-6 flex flex-col gap-6'>
                    <h2 className='text-xl font-semibold'>비밀번호 재설정</h2>
                    <input
                        type='password'
                        placeholder='새 비밀번호 입력'
                        className='border-line-300 border-b px-2 py-3'
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                    />

                    <input
                        type='password'
                        placeholder='새 비밀번호 확인'
                        className='border-line-300 border-b px-2 py-3'
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                    />
                </div>
                <div className='absolute bottom-0 left-0 w-full gap-6 p-6'>
                    <Button
                        variant={isFormValid ? 'primary' : 'primaryDisabled'}
                        className='w-full'
                        disabled={!isFormValid}
                        onClick={() => navigate('/login')}
                    >
                        비밀번호 변경
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetForm;
