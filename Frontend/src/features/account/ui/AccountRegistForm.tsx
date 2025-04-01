import { useNavigate } from 'react-router-dom';
import { registerAccount } from '../api/registerAccount';
import { useAccountForm } from '../model/useAccountForm';

const AccountRegistForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useAccountForm();
    const accountNumber = watch('accountNumber'); // 이렇게 접근

    const handleRequest = async () => {
        try {
            const data: string = await registerAccount({
                bankName: bank,
                accountNumber: accountNumber,
            });

            if (data === '존재하는 계좌입니다.') {
                navigate('/account/verify');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='mx-auto flex h-[calc(100vh-60px)] max-w-[480px] flex-col items-center justify-center gap-6 px-6'>
            <div className='text-center text-xl font-semibold'>
                계좌 등록을 위해 <br />
                1원을 송금합니다.
            </div>
            <div className='flex w-full flex-col gap-2'>
                <label className='text-sm font-medium'>은행명</label>
                <input
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className='rounded-md border px-4 py-2 text-sm'
                    placeholder='은행명을 입력하세요.'
                />
            </div>
            <div className='flex w-full flex-col gap-2'>
                <label className='text-sm font-medium'>계좌번호</label>
                <input
                    value={accountNum}
                    onChange={(e) => setAccountNum(e.target.value)}
                    className='rounded-md border px-4 py-2 text-sm'
                    placeholder='- 없이 숫자만 입력'
                />
            </div>
            <button
                onClick={handleRequest}
                className='mt-4 w-full rounded-md bg-black py-2 text-sm text-white'
            >
                1원 보내기
            </button>
        </div>
    );
};

export default AccountRegistForm;
