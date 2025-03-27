import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

const UserPasswordUpdate = () => {
    const navigate = useNavigate();
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const isFormValid = currentPw && newPw && confirmPw;

    const handleSubmit = async () => {
        try {
            // await axios.put('/api/users/password', {
            //     currentPassword: currentPw,
            //     newPassword: newPw,
            // });
            navigate('/');
        } catch (err) {
            console.error('비밀번호 변경 실패:', err);
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
        </div>
    );
};

export default UserPasswordUpdate;
