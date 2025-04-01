import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user/model/userStore';
import { verifyAccount } from '../api/verifyAccount';
import { useVerifyForm } from '../model/useVerifyForm';

const VerifyForm = () => {
    const navigate = useNavigate();
    const {
        bank,
        accountNum,
        password,
        setPassword,
        codeArr,
        setCodeArr,
        failModal,
        setFailModal,
    } = useVerifyForm();

    const setHasAccount = useUserStore((state) => state.setHasAccount);

    const handleVerify = async () => {
        try {
            const code = codeArr.join('');
            const data: string = await verifyAccount({
                verificationCode: code,
                bankName: bank,
                accountNumber: accountNum,
                accountPassword: password,
            });

            if (data === '계좌가 등록되었습니다.') {
                setHasAccount(true);
                navigate('/account/success');
            }
        } catch (err) {
            console.error(err);
            setFailModal(true);
        }
    };

    return (
        <div className='mx-auto flex h-[calc(100vh-60px)] max-w-[480px] flex-col items-center justify-center gap-6 px-6'>
            <div className='text-center text-xl font-semibold'>
                인증번호 4자리를 <br />
                입력해주세요.
            </div>
            <div className='flex gap-2'>
                {codeArr.map((val, idx) => (
                    <input
                        key={idx}
                        type='text'
                        maxLength={1}
                        className='h-12 w-12 rounded-md border text-center text-xl'
                        value={val}
                        onChange={(e) => {
                            const newCode = [...codeArr];
                            newCode[idx] = e.target.value;
                            setCodeArr(newCode);
                        }}
                    />
                ))}
            </div>
            <div className='flex w-full flex-col gap-2'>
                <label className='text-sm font-medium'>계좌 비밀번호</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    className='rounded-md border px-4 py-2 text-sm'
                    placeholder='6자리 숫자'
                />
            </div>
            <button
                onClick={handleVerify}
                className='mt-4 w-full rounded-md bg-black py-2 text-sm text-white'
            >
                확인
            </button>

            {failModal && (
                <div className='mt-4 text-sm text-red-500'>
                    인증번호가 유효하지 않거나 만료되었습니다.
                </div>
            )}
        </div>
    );
};

export default VerifyForm;
