import { Button } from '@/components/ui/button';
import Header from '@/widgets/layout/header/Header';

const SignupForm = () => {
    return (
        <div className='bg-line-50 flex flex-col gap-4 p-4'>
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
                        className='border-line-300 rounded border px-4 py-2 text-sm'
                    />
                    <input
                        type='password'
                        placeholder='비밀번호를 한 번 더 입력하세요.'
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
                            className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                        />
                        <Button>도로명 검색</Button>
                    </div>

                    <input
                        type='text'
                        placeholder='상세 주소를 입력하세요.'
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
                            className='border-line-300 min-w-0 flex-1 rounded border px-4 py-2 text-sm'
                        />
                        <Button>인증</Button>
                    </div>

                    <div className='mt-2 flex items-center gap-1'>
                        <input
                            type='text'
                            placeholder='인증 번호를 입력하세요.'
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
            <Button variant='primaryDisabled'>회원가입</Button>
        </div>
    );
};

export default SignupForm;
