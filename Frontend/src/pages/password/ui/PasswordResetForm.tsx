import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const PasswordResetForm = () => {
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const navigate = useNavigate();

    const isFormValid = oldPw && newPw && confirmPw;

    return (
        <div className='relative h-screen flex-col justify-between'>
            <div className='flex flex-col gap-6 p-6'>
                <Header title='비밀번호 변경' />

                <h2 className='text-xl font-semibold'>비밀번호 변경하기</h2>

                <p className='text-md text-line-950'>
                    기존 비밀번호를 입력하세요
                </p>
                <input
                    type='password'
                    placeholder='비밀번호 입력'
                    className='border-line-300 border-b px-2 py-3'
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                />

                <p className='text-md text-line-950'>
                    새 비밀번호를 입력하세요
                </p>
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
    );
};

export default PasswordResetForm;
