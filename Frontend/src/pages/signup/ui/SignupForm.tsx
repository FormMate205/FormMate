import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/widgets/layout/header/Header';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [certCode, setCertCode] = useState('');

    const navigate = useNavigate();

    const isFormValid =
        name &&
        email &&
        password &&
        passwordConfirm &&
        address &&
        detailAddress &&
        phone &&
        certCode;

    return (
        <div className='flex h-screen flex-col overflow-hidden'>
            <div className='bg-line-50 scrollbar-none relative flex-1 gap-4 overflow-y-auto p-4'>
                <Header title='회원가입' />

                <div className='mb-4 rounded-lg bg-white p-6 shadow-sm'>
                    {/* 성명 */}
                    <div className='flex flex-col gap-1'>
                        <label className='font-weight-regular text-font-size-text-md'>
                            성명
                        </label>
                        <input
                            type='text'
                            placeholder='성명을 입력하세요.'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='border-line-300 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 이메일 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>이메일</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type='email'
                                placeholder='이메일을 입력하세요.'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button>중복 확인</Button>
                        </div>

                        {/* 인증 성공 텍스트 */}
                        <p className='text-primary-500 mt-1 text-sm'>
                            ✓ 인증되었습니다.
                        </p>
                    </div>

                    {/* 비밀번호 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>비밀번호</label>
                        <input
                            type='password'
                            placeholder='비밀번호를 입력하세요.'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='border-line-300 rounded border px-4 py-2 text-sm'
                        />
                        <input
                            type='password'
                            placeholder='비밀번호를 한 번 더 입력하세요.'
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            className='border-line-300 mt-2 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 주소 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>주소</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type='text'
                                placeholder='도로명 주소를 입력하세요.'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button>도로명 검색</Button>
                        </div>

                        <input
                            type='text'
                            placeholder='상세 주소를 입력하세요.'
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                            className='border-line-300 mt-2 rounded border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className='mt-6 flex flex-col gap-1'>
                        <label>전화번호</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type='tel'
                                placeholder='전화번호를 입력하세요.'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button>인증</Button>
                        </div>

                        <div className='mt-2 flex items-center gap-1'>
                            <input
                                type='text'
                                placeholder='인증 번호를 입력하세요.'
                                value={certCode}
                                onChange={(e) => setCertCode(e.target.value)}
                                className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                            />
                            <Button>확인</Button>
                        </div>

                        {/* 실패 메시지 */}
                        <p className='text-subPink-700 mt-1 text-sm'>
                            ✖ 인증을 실패하였습니다.
                        </p>
                    </div>
                </div>

                {/* 회원가입 버튼 */}
                <Button
                    variant={isFormValid ? 'primary' : 'primaryDisabled'}
                    className='w-full'
                    onClick={() => navigate('/login')}
                >
                    회원가입
                </Button>
            </div>
        </div>
    );
};

export default SignupForm;
