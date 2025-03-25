import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NoticeModal } from '@/widgets';

const AccountVerifyForm = () => {
    const [codeArr, setCodeArr] = useState(['', '', '', '']);
    const [failModal, setFailModal] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (value: string, index: number) => {
        const updated = [...codeArr];
        updated[index] = value;
        setCodeArr(updated);
    };

    // 임시 인증번호 1234
    const handleVerify = () => {
        const code = codeArr.join('');
        if (code === '1234') navigate('/account/password');
        else setFailModal(true);
    };

    return (
        <div className='p-6'>
            <p className='mt-8 mb-4 text-lg font-semibold'>
                입금내역의 'SF' 뒤 숫자를 입력하세요.
            </p>

            <div className='bg-primary-50 items-center justify-between rounded-lg p-5'>
                <div className='mb-6 flex w-full justify-between'>
                    <p>입금자명</p>
                    <p>입금</p>
                </div>
                <div className='flex w-full items-center justify-between'>
                    <div className='flex gap-1'>
                        <span className='mr-1 text-3xl font-semibold'>SF</span>
                        {[...Array(4)].map((_, idx) => (
                            <input
                                key={idx}
                                className='h-9 w-9 rounded-md bg-white text-center'
                                maxLength={1}
                                onChange={(e) =>
                                    handleInputChange(e.target.value, idx)
                                }
                            />
                        ))}
                    </div>
                    <span>1원</span>
                </div>
            </div>

            <div className='fixed bottom-0 left-0 w-full p-6'>
                <Button
                    className='w-full'
                    variant='primary'
                    onClick={handleVerify}
                >
                    확인
                </Button>
            </div>

            {/* 실패 모달 */}
            <NoticeModal
                isOpen={failModal}
                title='인증실패'
                description={`입금자명의 숫자를 다시 확인해주세요.\n입력 가능 횟수 (1/3)`}
                onClose={() => setFailModal(false)}
            />
        </div>
    );
};

export default AccountVerifyForm;
