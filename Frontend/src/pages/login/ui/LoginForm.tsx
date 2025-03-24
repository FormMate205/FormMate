import { Button } from '@/components/ui/button';

export default function LoginForm() {
    return (
        <div className='mx-auto flex max-w-md flex-col gap-6 p-6'>
            <h1 className='mt-20 mb-20 text-center text-3xl font-bold'>
                서비스명
            </h1>

            <div className='flex flex-col gap-3'>
                <input
                    type='email'
                    placeholder='아이디(이메일)를 입력하세요.'
                    className='border-line-300 focus:ring-primary-500 rounded border px-4 py-3 focus:ring-2 focus:outline-none'
                />
                <input
                    type='password'
                    placeholder='비밀번호를 입력하세요.'
                    className='focus:ring-primary-500 border-line-300 rounded border px-4 py-3 focus:ring-2 focus:outline-none'
                />
                <Button variant='primary'>로그인</Button>
            </div>

            <div className='text-line-500 text-center text-sm'>
                <a href='/login/findPw' className='underline'>
                    비밀번호를 잊으셨나요?
                </a>
            </div>

            <div className='border-line-200 flex justify-center gap-3 border-t pt-6'>
                <img
                    src='/assets/images/google.png'
                    alt='구글'
                    className='h-10 w-10 cursor-pointer'
                />
                <img
                    src='/assets/images/naver.png'
                    alt='네이버'
                    className='h-10 w-10 cursor-pointer'
                />
                <img
                    src='/assets/images/kakao.png'
                    alt='카카오'
                    className='h-10 w-10 cursor-pointer'
                />
            </div>
        </div>
    );
}
